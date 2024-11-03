import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CreateTransferDto } from '../transfer/create-transfer.dto';

@UseGuards(JwtAuthGuard)
@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Get()
  async getAllTransfers(@Request() req) {
    const userId = req.user.userId;

    return this.transferService.getUserTransfers(userId);
  }

  @Get(':id')
  async getTransferById(@Request() req, @Param('id') id: number) {
    const userId = req.user.userId;

    const transfer = await this.transferService.getTransferById(id);

    if (
      !transfer ||
      (transfer.from?.id !== userId && transfer.to?.id !== userId)
    ) {
      throw new ForbiddenException('You do not have access to this transfer.');
    }
    return transfer;
  }

  @Post()
  async createTransfer(
    @Body() createTransferDto: CreateTransferDto,
    @Request() req,
  ) {
    const userId = req.user.userId;

    const transfer = await this.transferService.createTransfer(
      userId,
      createTransferDto,
    );
    return transfer;
  }
}
