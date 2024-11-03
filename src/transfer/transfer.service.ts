import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from 'src/transfer/transfer.entity';
import { BalanceService } from 'src/user/balance.service';
import { Repository, EntityManager } from 'typeorm';
import { CreateTransferDto } from './create-transfer.dto';
import { Balance } from 'src/user/balance.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private transferRepository: Repository<Transfer>,

    private readonly balanceService: BalanceService,
  ) {}

  async getUserTransfers(userId: number) {
    return this.transferRepository.find({
      where: [{ from: { id: userId } }, { to: { id: userId } }],
      order: { createdAt: 'DESC' },
      relations: ['from', 'to'],
    });
  }

  async getTransferById(id: number) {
    return this.transferRepository.findOne({
      where: { id },
      relations: ['from', 'to'],
    });
  }

  async createTransfer(
    fromUserId: number,
    transferDto: CreateTransferDto,
  ): Promise<Transfer> {
    const { amount, email, subject } = transferDto;

    return await this.transferRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const fromUserBalance = await entityManager.findOne(Balance, {
          where: { user: { id: fromUserId } },
        });

        if (!fromUserBalance || fromUserBalance.amount < amount) {
          throw new BadRequestException('Insufficient balance');
        }

        const fromUser = await entityManager.findOne(User, {
          where: { id: fromUserId },
        });

        const toUser = await entityManager.findOne(User, { where: { email } });
        if (!toUser) {
          throw new NotFoundException('Destination user not found');
        }

        const toUserBalance = await entityManager.findOne(Balance, {
          where: { user: toUser },
        });
        if (!toUserBalance) {
          throw new NotFoundException('Destination user balance not found');
        }

        fromUserBalance.amount -= amount;
        toUserBalance.amount += amount;

        await entityManager.save([fromUserBalance, toUserBalance]);

        const transfer = entityManager.create(Transfer, {
          from: fromUser,
          to: toUser,
          amount,
          subject: subject ?? '',
        });

        return await entityManager.save(Transfer, transfer);
      },
    );
  }

  async modifyUserBalance(
    user: User,
    amount: number,
    subject: string,
  ): Promise<Transfer> {
    return this.transferRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const userBalance = await this.balanceService.getBalance(user);

        if (!userBalance) {
          throw new NotFoundException('User balance not found');
        }

        userBalance.amount += amount;
        await entityManager.save([userBalance]);

        const transfer = entityManager.create(Transfer, {
          from: { id: user.id },
          to: { id: user.id },
          amount,
          subject,
        });

        return entityManager.save(Transfer, transfer);
      },
    );
  }
}
