import { Migration } from '@mikro-orm/migrations';

export class Migration20250523034146_make_emails_unique extends Migration {
  override up() {
    this.addSql(/* sql */ `
      ALTER TABLE "lead"
      ADD CONSTRAINT "lead_email_unique" UNIQUE ("email");
    `);
  }

  override down() {
    this.addSql(/* sql */ `
      ALTER TABLE "lead"
      DROP CONSTRAINT "lead_email_unique";
    `);
  }
}
