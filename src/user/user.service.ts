import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import { Balance } from './balance.entity';
import { BalanceService } from './balance.service';
import { UserPassword } from './user-password.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPassword)
    private userPassRepository: Repository<UserPassword>,
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
    private balanceService: BalanceService,
  ) {}

  async create(userData: Partial<User> & { password: string }): Promise<User> {
    const user = this.userRepository.create(userData);

    await this.userRepository.save(user);

    const password = this.userPassRepository.create({
      password: userData.password,
      user,
    });

    await this.userPassRepository.save(password);

    const balance = this.balanceRepository.create({ amount: 0, user });

    await this.balanceRepository.save(balance);

    return user;
  }

  async getUserPassword(user: User) {
    const { password } = await this.userPassRepository.findOne({
      where: { user: { id: user.id } },
    });

    return password;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findByIds(userIds: number[]): Promise<User[]> {
    return this.userRepository.find({
      where: {
        id: In(userIds),
      },
    });
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
