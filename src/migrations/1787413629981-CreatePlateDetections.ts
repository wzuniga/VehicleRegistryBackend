import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlateDetections1787413629981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.plate_detections (
        id SERIAL PRIMARY KEY,
        image_base64 text NOT NULL,
        possible_plate varchar(20),
        reviewed boolean NOT NULL DEFAULT false,
        reviewed_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.plate_detections`);
  }
}
