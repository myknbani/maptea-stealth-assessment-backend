import { EntityGenerator } from '@mikro-orm/entity-generator';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig, MikroORM, SimpleLogger } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { Logger } from '@nestjs/common';
import { CustomMigrationGenerator } from './orm/custom-migration-generator';
import { PostgreSqlOptions } from '@mikro-orm/postgresql/PostgreSqlMikroORM';

const additionalOptions: PostgreSqlOptions = {};
if (process.argv.some((arg) => arg.endsWith('node_modules/@mikro-orm/cli/cli'))) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is missing.');
  }

  additionalOptions.clientUrl = databaseUrl;
}

const logger = new Logger(MikroORM.name);
export default defineConfig({
  ...additionalOptions,
  extensions: [EntityGenerator, Migrator, SeedManager],
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  migrations: {
    generator: CustomMigrationGenerator,
    path: './dist/migrations',
    pathTs: './src/migrations',
    disableForeignKeys: false,
  },
  logger: (message: string) => {
    // this setting will only be respected if "spread" in .forRoot({...})
    logger.debug(message);
  },
  seeder: {
    defaultSeeder: 'MapteaEmptyTablesSeeder',
    path: './dist/seeds',
    pathTs: './src/seeds',
    glob: '**/*.seeder.{js,ts}',
  },
});
