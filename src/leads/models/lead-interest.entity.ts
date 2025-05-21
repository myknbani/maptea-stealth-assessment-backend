import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Lead } from './lead.entity';
import { ServiceType } from './service-type.entity';

@Entity()
export class LeadInterest {
  @PrimaryKey()
  id: number;

  @ManyToOne()
  lead: Lead;

  @ManyToOne()
  serviceType: ServiceType;

  /**
   *
   */
  @Property({ defaultRaw: 'now()' }) // ORM only sets the 2 FKs leaving created_at setting to the DB
  createdAt: Date = new Date();
}
