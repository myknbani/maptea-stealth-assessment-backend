import { EntityRepository } from '@mikro-orm/postgresql';
import { ServiceType } from './models/dining-service-type.entity';

export class ServiceTypeRepository extends EntityRepository<ServiceType> {}
