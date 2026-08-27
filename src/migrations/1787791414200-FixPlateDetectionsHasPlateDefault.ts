import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixPlateDetectionsHasPlateDefault1787791414200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // has_plate must be NULL for unreviewed rows (only set when a review actually
    // happens). The previous migration's "DEFAULT true" backfilled every existing
    // row, which is wrong — undo that here and drop the default going forward.
    await queryRunner.query(`
      ALTER TABLE public.plate_detections ALTER COLUMN has_plate DROP DEFAULT
    `);
    await queryRunner.query(`
      UPDATE public.plate_detections SET has_plate = NULL WHERE reviewed = false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.plate_detections ALTER COLUMN has_plate SET DEFAULT true
    `);
    await queryRunner.query(`
      UPDATE public.plate_detections SET has_plate = true WHERE reviewed = false AND has_plate IS NULL
    `);
  }
}
