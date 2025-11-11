import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sprl_sunarp', schema: 'public' })
export class SprlSunarp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  version: number;

  @Column({ name: 'registration_date', type: 'timestamp', nullable: true })
  registrationDate: Date;

  @Column({ name: 'presentation_date', type: 'timestamp', nullable: true })
  presentationDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ name: 'act_type', type: 'varchar', length: 100, nullable: true })
  actType: string;

  @Column({ name: 'natural_participants', type: 'text', nullable: true })
  naturalParticipants: string;

  @Column({ name: 'legal_participants', type: 'text', nullable: true })
  legalParticipants: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;

  @Column({ name: 'created_by', type: 'int4' })
  createdBy: number;

  @Column({ name: 'plate_number', type: 'varchar', length: 20, nullable: true })
  plateNumber: string;
}
