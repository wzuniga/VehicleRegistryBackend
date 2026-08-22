import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'credit_transactions', schema: 'auth' })
export class CreditTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar' })
  reason: string;

  @Column({ nullable: true, name: 'granted_by_admin_id', type: 'varchar' })
  grantedByAdminId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
