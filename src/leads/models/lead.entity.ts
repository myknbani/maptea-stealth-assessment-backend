import { Entity, EntityRepositoryType, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { LeadRepository } from '../lead.repository';
import { ServiceType } from './dining-service-type.entity';
import { LeadInterest } from './lead-interest.entity';

@Entity({ repository: () => LeadRepository })
export class Lead {
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

  @ManyToMany({ pivotEntity: () => LeadInterest })
  interests: ServiceType;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
