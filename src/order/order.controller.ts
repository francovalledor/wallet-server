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
import { OrderResponseDto } from './order-response.dto';

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
  ): Promise<OrderResponseDto[]> {
    const userId = req.user.userId;
    const orders = await this.orderService.findAll(userId, status);

    return this.orderService.toOrderResponseDtoList(orders);
  }

  @Get(':id')
  async getOrderById(
    @Request() req,
    @Param('id') id: number,
  ): Promise<OrderResponseDto> {
    const userId = req.user.userId;
    const order = await this.orderService.findOne(id, userId);

    return this.orderService.toOrderResponseDto(order);
  }

  @Patch(':id/cancel')
  async cancelOrder(
    @Request() req,
    @Param('id') id: number,
  ): Promise<OrderResponseDto> {
    const userId = req.user.userId;
    const order = await this.orderService.cancelOrder(id, userId);

    return this.orderService.toOrderResponseDto(order);
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
