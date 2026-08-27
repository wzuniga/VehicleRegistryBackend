import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlateDetectionsConfidenceFields1787790638491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.plate_detections
      ADD COLUMN IF NOT EXISTS has_plate boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS confidence real,
      ADD COLUMN IF NOT EXISTS detected_plate varchar(20)
    `);

    await queryRunner.query(`
      ALTER TABLE public.plate_detections
      ADD CONSTRAINT plate_detections_confidence_range
      CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.plate_detections
      DROP CONSTRAINT IF EXISTS plate_detections_confidence_range
    `);
    await queryRunner.query(`
      ALTER TABLE public.plate_detections
      DROP COLUMN IF EXISTS has_plate,
      DROP COLUMN IF EXISTS confidence,
      DROP COLUMN IF EXISTS detected_plate
    `);
  }
}
