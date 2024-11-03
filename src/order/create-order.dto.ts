import { IsNotEmpty, IsOptional, IsPositive, IsEmail } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @IsOptional()
  subject?: string;
}
