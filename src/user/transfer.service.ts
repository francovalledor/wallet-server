import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Transfer } from './transfer.entity';
import { User } from './user.entity';
import { Balance } from './balance.entity';
import { TransferDto } from './transfer.dto';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private transferRepository: Repository<Transfer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
  ) {}

  async createTransfer(
    fromUserId: number,
    transferDto: TransferDto,
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
          from: { id: fromUserId },
          to: toUser,
          amount,
          subject: subject ?? '',
        });
        return await entityManager.save(Transfer, transfer);
      },
    );
  }
}
