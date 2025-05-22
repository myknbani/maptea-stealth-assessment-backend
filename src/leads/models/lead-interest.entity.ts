import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';
import { Lead } from './lead.entity';
import { ServiceType } from './service-type.entity';

/**
 * A pivot table for the many-to-many relationship between {@link Lead} and {@link ServiceType}.
 * This is a pivot entity, such that it can be used to store additional information about the
 * relationship, even if it's just the `createdAt` timestamp.
 */
@Entity()
export class LeadInterest {
  @PrimaryKey()
  id: number;

  @ManyToOne({ ref: true })
  lead: Ref<Lead>;

  @ManyToOne({ ref: true })
  serviceType: Ref<ServiceType>;

  @Property({ defaultRaw: 'now()' }) // ORM only sets the 2 FKs leaving created_at setting to the DB
  createdAt: Date = new Date();
}
