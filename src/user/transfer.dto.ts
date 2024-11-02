import { IsNumber, IsEmail, IsOptional, IsString, Min } from 'class-validator';

export class TransferDto {
  @IsNumber()
  @Min(0.1, { message: 'The transfer amount must be greater than 0' })
  amount: number;

  @IsEmail({}, { message: 'The destination email is invalid' })
  email: string;

  @IsOptional()
  @IsString()
  subject?: string;
}
