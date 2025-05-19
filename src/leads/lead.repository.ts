import { EntityRepository } from '@mikro-orm/postgresql';
import { Lead } from './models/lead.entity';

export class LeadRepository extends EntityRepository<Lead> {}
