import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './create-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const requesterId = req.user.userId;

    return this.orderService.createOrder({
      ...createOrderDto,
      requesterId,
    });
  }
}
