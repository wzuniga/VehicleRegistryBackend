import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'vehicle', schema: 'public' })
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'serial_number', type: 'varchar', length: 50, nullable: true })
  serialNumber: string;

  @Column({ name: 'vin_number', type: 'varchar', length: 50, nullable: true })
  vinNumber: string;

  @Column({ name: 'engine_number', type: 'varchar', length: 50, nullable: true })
  engineNumber: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  color: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  model: string;

  @Column({ name: 'current_plate', type: 'varchar', length: 20, nullable: true })
  currentPlate: string;

  @Column({ name: 'previous_plate', type: 'varchar', length: 20, nullable: true })
  previousPlate: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  state: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'branch_office', type: 'varchar', length: 50, nullable: true })
  branchOffice: string;

  @Column({ name: 'model_year', type: 'int4', nullable: true })
  modelYear: number;

  @Column({ type: 'text', nullable: true })
  owners: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;

  @Column({ name: 'plate_number', type: 'varchar', length: 20 })
  plateNumber: string;

  @Column({ name: 'imagebase64', type: 'text', nullable: true })
  imageBase64: string;
}

