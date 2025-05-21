import { Migration } from '@mikro-orm/migrations';

export class Migration20250521021719_delegate_remove_dining_prefix_for_pivot_fk extends Migration {
  override up() {
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      DROP CONSTRAINT "lead_interest_dining_service_type_id_foreign";
    `);

    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      RENAME COLUMN "dining_service_type_id" TO "service_type_id";
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ADD CONSTRAINT "lead_interest_service_type_id_foreign" 
        FOREIGN key ("service_type_id") REFERENCES "service_type" ("id") ON UPDATE CASCADE;
    `);
  }

  override down() {
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      DROP CONSTRAINT "lead_interest_service_type_id_foreign";
    `);

    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      RENAME COLUMN "service_type_id" TO "dining_service_type_id";
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ADD CONSTRAINT "lead_interest_dining_service_type_id_foreign" \
        FOREIGN key ("dining_service_type_id") REFERENCES "service_type" ("id") ON UPDATE CASCADE;
    `);
  }
}
