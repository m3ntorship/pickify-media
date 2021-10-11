import { MigrationInterface, QueryRunner } from 'typeorm';
import { MEDIA_SCHEMA } from '../entity.model';

// Initial migration to run whenever the microservie starts
// It mainly to create scheam & create tables used in the microservie

export class init1623001592704 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS ${MEDIA_SCHEMA}`);
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${MEDIA_SCHEMA}"."media" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "uploaded" boolean NOT NULL, "original_url" character varying, "name" character varying NOT NULL, CONSTRAINT "PK_026af23480d8d75860a4abf1a98" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS ${MEDIA_SCHEMA} CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "${MEDIA_SCHEMA}"."media"`);
  }
}
