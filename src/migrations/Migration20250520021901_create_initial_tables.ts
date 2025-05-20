import { Migration } from '@mikro-orm/migrations';

export class Migration20250520021901_create_initial_tables extends Migration {
  override up() {
    this.addSql(/* sql */ `
      CREATE TABLE "lead" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "full_phone_number" varchar(255) NOT NULL,
        "post_code" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL,
        "updated_at" timestamptz NOT NULL
      );
    `);

    this.addSql(/* sql */ `
      CREATE TABLE "service_type" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL,
        "updated_at" timestamptz NOT NULL
      );
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "service_type"
      ADD CONSTRAINT "service_type_name_unique" UNIQUE ("name");
    `);

    this.addSql(/* sql */ `
      CREATE TABLE "lead_interest" (
        "id" serial PRIMARY KEY,
        "lead_id" int NOT NULL,
        "dining_service_type_id" int NOT NULL,
        "created_at" timestamptz NOT NULL,
        "updated_at" timestamptz NOT NULL
      );
    `);

    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ADD CONSTRAINT "lead_interest_lead_id_foreign" FOREIGN key ("lead_id") REFERENCES "lead" ("id") ON UPDATE CASCADE;
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ADD CONSTRAINT "lead_interest_dining_service_type_id_foreign" FOREIGN key ("dining_service_type_id") REFERENCES "service_type" ("id") ON UPDATE CASCADE;
    `);
  }

  override down() {
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      DROP CONSTRAINT "lead_interest_lead_id_foreign";
    `);

    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      DROP CONSTRAINT "lead_interest_dining_service_type_id_foreign";
    `);

    this.addSql(/* sql */ `
      DROP TABLE IF EXISTS "lead" cascade;
    `);

    this.addSql(/* sql */ `
      DROP TABLE IF EXISTS "service_type" cascade;
    `);

    this.addSql(/* sql */ `
      DROP TABLE IF EXISTS "lead_interest" cascade;
    `);
  }
}
