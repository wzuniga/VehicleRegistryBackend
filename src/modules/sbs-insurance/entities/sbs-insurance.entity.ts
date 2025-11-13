import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sbs_insurance', schema: 'public' })
export class SbsInsurance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'plate_number', type: 'varchar', length: 20 })
  plateNumber: string;

  @Column({ name: 'soat_accidents', type: 'int4', default: 0, nullable: true })
  soatAccidents: number;

  @Column({ name: 'soat_table_details', type: 'text', nullable: true })
  soatTableDetails: string;

  @Column({ name: 'insurance_accidents', type: 'int4', default: 0, nullable: true })
  insuranceAccidents: number;

  @Column({ name: 'insurance_table_details', type: 'text', nullable: true })
  insuranceTableDetails: string;

  @Column({ name: 'cat_accidents', type: 'int4', default: 0, nullable: true })
  catAccidents: number;

  @Column({ name: 'cat_table_details', type: 'text', nullable: true })
  catTableDetails: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;
}
