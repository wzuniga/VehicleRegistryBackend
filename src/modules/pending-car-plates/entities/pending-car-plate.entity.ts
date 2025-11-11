import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'pending_car_plates', schema: 'public' })
export class PendingCarPlate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 10 })
  plate: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'is_loaded', type: 'boolean', default: false, nullable: true })
  isLoaded: boolean;

  @Column({ name: 'search_attempts', type: 'int4', default: 0 })
  searchAttempts: number;
}
