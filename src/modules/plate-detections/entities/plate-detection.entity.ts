import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'plate_detections', schema: 'public' })
export class PlateDetection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'image_base64', type: 'text' })
  imageBase64: string;

  @Column({ name: 'possible_plate', type: 'varchar', length: 20, nullable: true, unique: true })
  possiblePlate: string;

  @Column({ type: 'boolean', default: false })
  reviewed: boolean;

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt: Date;

  @Column({ name: 'has_plate', type: 'boolean', nullable: true })
  hasPlate: boolean;

  @Column({ type: 'real', nullable: true })
  confidence: number;

  @Column({ name: 'detected_plate', type: 'varchar', length: 20, nullable: true })
  detectedPlate: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt: Date;
}
