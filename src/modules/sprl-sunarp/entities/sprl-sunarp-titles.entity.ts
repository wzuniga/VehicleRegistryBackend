import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sprl_sunarp_titles', schema: 'public' })
export class SprlSunarpTitles {
  @PrimaryColumn({ name: 'titulo_year', type: 'varchar', length: 10 })
  tituloYear: string;

  @PrimaryColumn({ name: 'titulo_number', type: 'varchar', length: 20 })
  tituloNumber: string;

  @Column({ name: 'titulo_extracted', type: 'boolean', default: false })
  tituloExtracted: boolean;

  @Column({ name: 'plate', type: 'varchar', length: 20, nullable: true })
  plate: string;

  @Column({ name: 'pdf_base64', type: 'text', nullable: true })
  pdfBase64: string;

  @Column({ type: 'int4', default: 0 })
  attempts: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;
}
