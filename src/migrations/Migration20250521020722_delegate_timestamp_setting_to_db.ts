import { Migration } from '@mikro-orm/migrations';

export class Migration20250521020722_delegate_timestamp_setting_to_db extends Migration {
  override up() {
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      DROP COLUMN "updated_at";
    `);

    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ALTER COLUMN "created_at"
      SET DEFAULT now();
    `);
  }

  override down() {
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ADD COLUMN "updated_at" timestamptz NOT NULL;
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ALTER COLUMN "created_at"
      DROP DEFAULT;
    `);
  }
}
