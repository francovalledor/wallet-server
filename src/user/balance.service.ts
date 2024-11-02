import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Balance } from './balance.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
  ) {}

  async getBalance(user: User): Promise<Balance> {
    return this.balanceRepository.findOne({
      where: { user: { id: user.id } },
    });
  }
}
