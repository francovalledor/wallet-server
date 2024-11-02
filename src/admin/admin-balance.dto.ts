import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class AdminBalanceDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  subject: string;
}
