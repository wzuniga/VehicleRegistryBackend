import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSatArequipa1787800000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.sat_arequipa (
        id SERIAL PRIMARY KEY,
        plate_number varchar(20) NOT NULL,
        data jsonb,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.sat_arequipa`);
  }
}
