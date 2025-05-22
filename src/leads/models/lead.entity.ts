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

@Entity({ repository: () => LeadRepository })
@ObjectType()
export class Lead {
  @HideField()
  [EntityRepositoryType]?: LeadRepository;

  @PrimaryKey()
  @Field(() => Int)
  id: number;

  @Property()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Property()
  @IsEmail()
  email: string;

  @Property()
  @Transform(({ value }: { value: string }) => value.replace(/^(\d)/, '+$1'))
  @IsPhoneNumber()
  fullPhoneNumber: string;

  @Property()
  @IsString() // @IsPostalCode() might be too strict for some countries
  @IsNotEmpty()
  postCode: string;

  @Field(() => [ServiceType])
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
