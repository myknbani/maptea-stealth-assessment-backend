import { Migration } from '@mikro-orm/migrations';

export class Migration20250519030135_create_lead_table extends Migration {
  override up() {
    this.addSql(/* sql */ `
      CREATE TABLE "lead" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "full_phone_number" varchar(255) NOT NULL,
        "post_code" varchar(255) NOT NULL
      );
    `);
  }

  override down() {
    this.addSql(/* sql */ `
      DROP TABLE IF EXISTS "lead" cascade;
    `);
  }
}
