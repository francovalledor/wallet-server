import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './create-order.dto';
import { Order } from './order.entity';
import { Transfer } from 'src/user/transfer.entity';

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

  @Get()
  async getOrders(
    @Request() req,
    @Query('status') status?: string,
  ): Promise<Order[]> {
    const userId = req.user.userId;
    return this.orderService.findAll(userId, status);
  }

  @Get(':id')
  async getOrderById(@Request() req, @Param('id') id: number): Promise<Order> {
    const userId = req.user.userId;
    return this.orderService.findOne(id, userId);
  }

  @Patch(':id/cancel')
  async cancelOrder(@Request() req, @Param('id') id: number): Promise<Order> {
    const userId = req.user.userId;
    return this.orderService.cancelOrder(id, userId);
  }

  @Patch(':id/complete')
  async completeOrder(
    @Request() req,
    @Param('id') id: number,
  ): Promise<Transfer> {
    const userId = req.user.userId;
    return this.orderService.completeOrder(id, userId);
  }
}
