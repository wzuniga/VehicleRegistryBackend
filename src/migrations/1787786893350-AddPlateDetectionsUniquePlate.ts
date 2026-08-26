import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlateDetectionsUniquePlate1787786893350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove pre-existing duplicates before the constraint can be created.
    // Keeps the oldest row (first detection) per plate, drops the rest.
    await queryRunner.query(`
      DELETE FROM public.plate_detections pd
      USING (
        SELECT id, ROW_NUMBER() OVER (
          PARTITION BY possible_plate ORDER BY created_at ASC, id ASC
        ) AS rn
        FROM public.plate_detections
        WHERE possible_plate IS NOT NULL
      ) ranked
      WHERE pd.id = ranked.id AND ranked.rn > 1
    `);

    await queryRunner.query(`
      ALTER TABLE public.plate_detections
      ADD CONSTRAINT plate_detections_possible_plate_key UNIQUE (possible_plate)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.plate_detections
      DROP CONSTRAINT IF EXISTS plate_detections_possible_plate_key
    `);
    // Deleted duplicate rows are not restored.
  }
}
