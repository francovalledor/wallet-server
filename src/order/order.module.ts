import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { User } from 'src/user/user.entity';
import { Balance } from 'src/user/balance.entity';
import { UserModule } from 'src/user/user.module';
import { TransferModule } from 'src/transfer/transfer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UserModule, TransferModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
