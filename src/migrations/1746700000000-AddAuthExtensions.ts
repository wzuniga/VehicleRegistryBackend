import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthExtensions1746700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create auth schema if not exists
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS auth`);

    // Create users table if not exists (in case it's brand new)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth.users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar NOT NULL UNIQUE,
        password varchar,
        name varchar,
        role varchar NOT NULL DEFAULT 'client',
        google_id varchar,
        credits integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    // Add new columns to existing users table (safe: only if they don't exist)
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='auth' AND table_name='users' AND column_name='password') THEN
          ALTER TABLE auth.users ADD COLUMN password varchar;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='auth' AND table_name='users' AND column_name='name') THEN
          ALTER TABLE auth.users ADD COLUMN name varchar;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='auth' AND table_name='users' AND column_name='role') THEN
          ALTER TABLE auth.users ADD COLUMN role varchar NOT NULL DEFAULT 'client';
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='auth' AND table_name='users' AND column_name='google_id') THEN
          ALTER TABLE auth.users ADD COLUMN google_id varchar;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='auth' AND table_name='users' AND column_name='credits') THEN
          ALTER TABLE auth.users ADD COLUMN credits integer NOT NULL DEFAULT 0;
        END IF;
      END $$;
    `);

    // Ensure password is nullable (for Google-only users)
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema='auth' AND table_name='users'
          AND column_name='password' AND is_nullable='NO'
        ) THEN
          ALTER TABLE auth.users ALTER COLUMN password DROP NOT NULL;
        END IF;
      END $$;
    `);

    // Create credit_transactions table (user_id as varchar, no FK to support any id type)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth.credit_transactions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id varchar NOT NULL,
        amount integer NOT NULL,
        reason varchar NOT NULL,
        granted_by_admin_id varchar,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS auth.credit_transactions`);
    await queryRunner.query(`ALTER TABLE auth.users DROP COLUMN IF EXISTS credits`);
    await queryRunner.query(`ALTER TABLE auth.users DROP COLUMN IF EXISTS google_id`);
    await queryRunner.query(`ALTER TABLE auth.users DROP COLUMN IF EXISTS role`);
  }
}
