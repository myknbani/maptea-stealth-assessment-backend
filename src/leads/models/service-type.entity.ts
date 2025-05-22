import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core';
import { ServiceTypeRepository } from '../service-type.repository';
import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';

/**
 * Entity representing the dining service types. Right now the purpose is just to provide a list
 * of possible intrests for leads to select from when they sign up.
 *
 * It's a lookup table rather than an enum such that we can add more types leads are interested in
 * without having to redeploy the app.  Possible values in the future could be:
 * - Dine Out (e.g. {@link https://www.uber.com/en-AU/blog/introducing-dine-out/ Uber Eats - Dine Out})
 * - or even groceries
 */
@Entity({ repository: () => ServiceTypeRepository })
@ObjectType()
export class ServiceType {
  @HideField()
  [EntityRepositoryType]?: ServiceTypeRepository;

  /**
   * The unique identifier for the service type.
   */
  @PrimaryKey()
  @Field(() => Int)
  id: number;

  /**
   * The name of the service type.
   */
  @Property({ unique: true })
  name: string;

  /**
   * The date and time when the service type was created.
   */
  @Property()
  createdAt: Date = new Date();

  /**
   * The date and time when the service type was last updated.
   *
   * On creation, this is set to the same value as `createdAt`.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(data: Partial<ServiceType>) {
    Object.assign(this, data);
  }
}
