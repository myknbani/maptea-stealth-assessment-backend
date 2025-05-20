import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { ServiceTypeSeeder } from './service-type.seeder';

export class MapteaEmptyTablesSeeder extends Seeder {
  run(entityManager: EntityManager) {
    return this.call(entityManager, [ServiceTypeSeeder]);
  }
}
