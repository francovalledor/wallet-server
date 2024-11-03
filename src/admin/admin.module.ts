import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { Balance } from 'src/user/balance.entity';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Transfer } from 'src/transfer/transfer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { BalanceService } from 'src/user/balance.service';
import { TransferModule } from 'src/transfer/transfer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transfer, User, Balance]),
    UserModule,
    TransferModule,
  ],
  controllers: [AdminController],
  providers: [],
})
export class AdminModule {}
