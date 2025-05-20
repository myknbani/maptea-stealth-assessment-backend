import { InputType, OmitType } from '@nestjs/graphql';
import { Lead } from './lead.entity';

@InputType()
export class RegisterLeadInput extends OmitType(Lead, [
  'id',
  'createdAt',
  'updatedAt',
  'servicesInterests',
] as const) {
  servicesInterests: string[];

  constructor(data: RegisterLeadInput) {
    super();
    Object.assign(this, data);
  }
}
