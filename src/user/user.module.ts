import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Balance } from './balance.entity';
import { BalanceService } from './balance.service';

import { Transfer } from '../transfer/transfer.entity';
import { UserPassword } from './user-password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPassword, Balance, Transfer]),
    Transfer,
  ],
  providers: [UserService, BalanceService],
  controllers: [UserController],
  exports: [UserService, BalanceService],
})
export class UserModule {}
