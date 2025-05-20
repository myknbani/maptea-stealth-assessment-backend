import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core';
import { ServiceTypeRepository } from '../service-type.repository';

/**
 * Entity representing the dining service types. Right now the purpose is just to provide a list
 * of possible intrests for leads to select from when they sign up.
 *
 * It's a lookup table rather than an enum such that we can add more types leads are interested in
 * without having to redeploy the app.  Possible values in the future could be:
 * - Dine Out _(e.g. {@link https://www.uber.com/en-AU/blog/introducing-dine-out/ Uber Eats - Dine Out})
 * - or even groceries
 */
@Entity({ repository: () => ServiceTypeRepository })
export class ServiceType {
  [EntityRepositoryType]?: ServiceTypeRepository;

  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(data: Partial<ServiceType>) {
    Object.assign(this, data);
  }
}
