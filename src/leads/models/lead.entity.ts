import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core';
import { LeadRepository } from '../lead.repository';

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
}
