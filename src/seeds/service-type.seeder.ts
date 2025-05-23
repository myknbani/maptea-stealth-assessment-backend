import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { ServiceType } from '../leads/models/service-type.entity';

/**
 * Seeder to populate the database with the three known services stated in the exercise requirements.
 * - pick-up
 * - delivery
 * - payment
 */
export class ServiceTypeSeeder extends Seeder {
  async run(entityManager: EntityManager) {
    const repository = entityManager.getRepository(ServiceType);

    if ((await repository.count()) > 0) {
      return;
    }

    repository.create(new ServiceType({ name: 'pick-up' }));
    repository.create(new ServiceType({ name: 'delivery' }));
    repository.create(new ServiceType({ name: 'payment' }));
  }
}
