import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Balance } from './balance.entity';
import { BalanceService } from './balance.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
    private balanceService: BalanceService,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);

    await this.userRepository.save(user);

    const balance = this.balanceRepository.create({ amount: 0, user });

    await this.balanceRepository.save(balance);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findUserWithBalance(
    userId: number,
  ): Promise<{ email: string; balance: number }> {
    const user = await this.findById(userId);
    if (!user) throw new Error('User not found');

    const balance = await this.balanceService.getBalance(user);

    return {
      email: user.email,
      balance: balance.amount,
    };
  }
}
