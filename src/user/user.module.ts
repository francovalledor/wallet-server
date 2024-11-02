import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Balance } from './balance.entity';
import { BalanceService } from './balance.service';
import { TransferService } from './transfer.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Balance])],
  providers: [UserService, BalanceService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
