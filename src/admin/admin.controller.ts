import { Controller, Post, Body } from '@nestjs/common';
import { TransferService } from 'src/user/transfer.service';
import { AdminBalanceDto } from './admin-balance.dto';
import { Transfer } from 'src/user/transfer.entity';
import { UserService } from 'src/user/user.service';
import { Balance } from 'src/user/balance.entity';
import { BalanceService } from 'src/user/balance.service';
import { User } from 'src/user/user.entity';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly transferService: TransferService,
    private readonly userService: UserService,
    private readonly balanceService: BalanceService,
  ) {}

  @Post('modify-balance')
  async modifyBalance(
    @Body() adminBalanceDto: AdminBalanceDto,
  ): Promise<User & { balance: number; transfer: Transfer }> {
    const { userId, amount, subject } = adminBalanceDto;

    const user = await this.userService.findById(userId);

    const transfer = await this.transferService.modifyUserBalance(
      user,
      amount,
      subject,
    );

    const balance = await this.balanceService.getBalance(user);

    return { ...user, balance: balance.amount, transfer };
  }
}
