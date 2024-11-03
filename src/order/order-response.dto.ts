export class OrderResponseDto {
  id: number;

  amount: number;

  status: string;

  requesterEmail: string;

  recipientEmail?: string;

  subject?: string;

  createdAt: Date;

  updatedAt: Date;
}
