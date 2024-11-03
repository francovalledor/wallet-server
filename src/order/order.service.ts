import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async cancelOrder(orderId: number, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.requesterId !== userId) {
      throw new BadRequestException('Only the requester can cancel the order');
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  async findAll(userId: number, status?: string): Promise<Order[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.requesterId = :userId OR order.recipientId = :userId', {
        userId,
      });

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    return queryBuilder
      .orderBy('order.updatedAt', 'DESC')
      .addOrderBy('order.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number, userId: number): Promise<Order> {
    return this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .andWhere(
        '(order.requesterId = :userId OR order.recipientId = :userId OR order.recipientId IS NULL)',
        { userId },
      )
      .getOne();
  }
}
