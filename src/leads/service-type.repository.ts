import { EntityRepository } from '@mikro-orm/postgresql';
import { ServiceType } from './models/service-type.entity';

export class ServiceTypeRepository extends EntityRepository<ServiceType> {}
