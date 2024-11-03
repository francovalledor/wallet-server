import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { TransferService } from 'src/user/transfer.service';
import { Balance } from 'src/user/balance.entity';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Transfer } from 'src/user/transfer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { BalanceService } from 'src/user/balance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer, User, Balance]), UserModule],
  controllers: [AdminController],
  providers: [],
})
export class AdminModule {}
