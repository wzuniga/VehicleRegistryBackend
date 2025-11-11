import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'license_plate_master', schema: 'public' })
export class LicensePlateMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'public_code', type: 'uuid', unique: true })
  publicCode: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;

  @Column({ name: 'plate_number', unique: true, length: 20 })
  plateNumber: string;
}
