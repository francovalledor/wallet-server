import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
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

    const balance = await this.getBalance(userId);

    return {
      email: user.email,
      balance,
    };
  }

  private async getBalance(userId: number): Promise<number> {
    return 100;
  }
}
