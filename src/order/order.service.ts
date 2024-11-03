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
import { Transfer } from 'src/user/transfer.entity';
import { BalanceService } from 'src/user/balance.service';
import { TransferService } from 'src/user/transfer.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly userService: UserService,
    private readonly balanceService: BalanceService,
    private readonly transferService: TransferService,
  ) {}

  async findById(orderId: number): Promise<Order | undefined> {
    return this.orderRepository.findOne({ where: { id: orderId } });
  }

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
    const order = await this.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.requesterId !== userId) {
      throw new BadRequestException('Only the requester can cancel the order');
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  async completeOrder(orderId: number, userId: number): Promise<Transfer> {
    const order = await this.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.requesterId === userId) {
      throw new BadRequestException('You cannot complete your own order');
    }

    if (order.status !== OrderStatus.OPEN) {
      throw new BadRequestException(
        'Cannot complete an order that is not OPEN.',
      );
    }

    if (order.recipientId && order.recipientId !== userId) {
      throw new BadRequestException(
        'Only the recipient can complete this order',
      );
    }

    const recipientUser = await this.userService.findById(userId);

    const userBalance = await this.balanceService.getBalance(recipientUser);

    if (userBalance.amount <= 0) {
      throw new BadRequestException(
        'Insufficient balance to complete the order',
      );
    }

    const requesterUser = await this.userService.findById(order.requesterId);

    const savedTransfer = await this.transferService.createTransfer(
      recipientUser.id,
      {
        amount: order.amount,
        email: requesterUser.email,
        subject: 'Order payment',
      },
    );

    order.status = OrderStatus.COMPLETED;
    await this.orderRepository.save(order);

    return savedTransfer;
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
