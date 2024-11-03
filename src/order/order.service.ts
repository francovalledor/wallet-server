import { Injectable } from '@nestjs/common';
import { Order, OrderStatus } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderDto } from './create-order.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly userService: UserService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto & { requesterId: number }) {
    const recipient: User | null | undefined = createOrderDto.recipientEmail
      ? await this.userService.findByEmail(createOrderDto.recipientEmail)
      : null;

    const order = this.orderRepository.create({
      ...createOrderDto,
      recipientId: recipient?.id,
      status: OrderStatus.OPEN,
    });
    return this.orderRepository.save(order);
  }
}
