import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'inspeccion_vehicular', schema: 'public' })
export class InspeccionVehicular {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'plate_number', type: 'varchar', length: 20 })
  plateNumber: string;

  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;
}
