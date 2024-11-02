import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  OPEN = 'OPEN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requesterId: number;

  @Column({ nullable: true })
  recipientId: number;

  @Column()
  amount: number;

  @Column({ nullable: true })
  subject: string;

  @Column({ type: 'text', default: OrderStatus.OPEN })
  status: OrderStatus;

  @Column({ nullable: true })
  transferId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
