import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { LeadRepository } from '../lead.repository';
import { LeadInterest } from './lead-interest.entity';
import { ServiceType } from './service-type.entity';

/**
 * Entity representing a lead. A lead is a potential customer who has expressed interest in
 * the service types offered by the business.
 */
@Entity({ repository: () => LeadRepository })
@ObjectType()
export class Lead {
  /**
   * The repository for the lead entity's repository.  This is needed by the ORM to correctly
   * infer the type rather than use `EntityRepository<Lead>`, which will have no extra methods.
   *
   * @see {@link https://mikro-orm.io/docs/repositories#inferring-custom-repository-type}
   */
  @HideField()
  [EntityRepositoryType]?: LeadRepository;

  /**
   * The unique identifier for the lead.
   */
  @PrimaryKey()
  @Field(() => Int)
  id: number;

  /**
   * The full name of the lead.
   */
  @Property()
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The email address of the lead.
   */
  @Property({ unique: true })
  @IsEmail()
  email: string;

  /**
   * The full phone number of the lead in E.164 format.  A plus sign is added to the start of
   * the number if it doesn't already start with one.  This is done to ensure that the number
   * will pass the {@link IsPhoneNumber} validation.
   */
  @Property()
  @Transform(({ value }: { value: string }) => value.replace(/^(\d)/, '+$1'))
  @IsPhoneNumber()
  fullPhoneNumber: string;

  /**
   * The postal code of the lead.  This is used to determine the service area of the lead.
   */
  @Property()
  @IsString() // @IsPostalCode() might be too strict for some countries
  @IsNotEmpty()
  postCode: string;

  /**
   * The service types that the lead is interested in.  This is a many-to-many relationship
   * with the {@link ServiceType} entity.
   */
  @Field(() => [ServiceType])
  @ManyToMany({ pivotEntity: () => LeadInterest })
  servicesInterestedIn: Collection<ServiceType> = new Collection<ServiceType>(this);

  /**
   * The date and time when the lead was created.
   */
  @Property()
  createdAt: Date = new Date();

  /**
   * The date and time when the lead was last updated.
   *
   * On creation, this is set to the same value as `createdAt`.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(lead: Partial<Lead>) {
    Object.assign(this, lead);
  }
}
