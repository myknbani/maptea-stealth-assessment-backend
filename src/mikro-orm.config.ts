import { EntityGenerator } from '@mikro-orm/entity-generator';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { Logger } from '@nestjs/common';
import { CustomMigrationGenerator } from './orm/custom-migration-generator';

const url = process.env.DATABASE_URL; // Needed by migrations and seeders that run outside of Nest

if (!url) {
  throw new Error('DATABASE_URL environment variable is missing.');
}

const mikroOrmLogger = new Logger('MikroORM');
export default defineConfig({
  extensions: [EntityGenerator, Migrator, SeedManager],
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  clientUrl: url,
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  migrations: {
    generator: CustomMigrationGenerator,
    path: './dist/migrations',
    pathTs: './src/migrations',
    disableForeignKeys: false,
  },
  logger: (message) => mikroOrmLogger.debug(message),
  seeder: {
    defaultSeeder: 'MapteaEmptyTablesSeeder',
    path: './dist/seeds',
    pathTs: './src/seeds',
    glob: '**/*.seeder.{js,ts}',
  },
});
