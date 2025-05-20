import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Lead } from './lead.entity';
import { ServiceType } from './dining-service-type.entity';

@Entity()
export class LeadInterest {
  @PrimaryKey()
  id: number;

  @ManyToOne()
  lead: Lead;

  @ManyToOne()
  diningServiceType: ServiceType;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
