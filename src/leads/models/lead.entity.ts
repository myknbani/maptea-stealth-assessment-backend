import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { LeadRepository } from '../lead.repository';
import { ServiceType } from './service-type.entity';
import { LeadInterest } from './lead-interest.entity';
import { HideField, ObjectType } from '@nestjs/graphql';

console.log('*** Lead entity loaded', EntityRepositoryType);

@Entity({ repository: () => LeadRepository })
@ObjectType()
export class Lead {
  @HideField()
  [EntityRepositoryType]?: LeadRepository;

  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  email: string;

  @Property()
  fullPhoneNumber: string;

  @Property()
  postCode: string;

  @HideField() // temporary
  @ManyToMany({ pivotEntity: () => LeadInterest })
  servicesInterests: Collection<ServiceType> = new Collection<ServiceType>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(lead: Partial<Lead>) {
    Object.assign(this, lead);
  }
}
