import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Balance } from './balance.entity';
import { BalanceService } from './balance.service';
import { TransferService } from './transfer.service';
import { Transfer } from './transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Balance, Transfer])],
  providers: [UserService, BalanceService, TransferService],
  controllers: [UserController],
  exports: [UserService, BalanceService, TransferService],
})
export class UserModule {}
