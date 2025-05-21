import { Migration } from '@mikro-orm/migrations';

export class Migration20250521043458_add_user_table extends Migration {
  override up() {
    this.addSql(/* sql */ `
      CREATE TABLE "user" (
        "id" serial PRIMARY KEY,
        "username" varchar(255) NOT NULL,
        "hashed_password" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL,
        "updated_at" timestamptz NOT NULL
      );
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "user"
      ADD CONSTRAINT "user_username_unique" UNIQUE ("username");
    `);
  }

  override down() {
    this.addSql(/* sql */ `
      DROP TABLE IF EXISTS "user" cascade;
    `);
  }
}
