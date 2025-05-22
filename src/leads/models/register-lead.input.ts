import { InputType, OmitType } from '@nestjs/graphql';
import { Lead } from './lead.entity';
import { ArrayMinSize, IsString } from 'class-validator';

@InputType()
export class RegisterLeadInput extends OmitType(
  Lead,
  ['id', 'createdAt', 'updatedAt', 'servicesInterests'],
  InputType,
) {
  @IsString({ each: true })
  @ArrayMinSize(1)
  servicesInterests: string[];

  constructor(data: RegisterLeadInput) {
    super();
    Object.assign(this, data);
  }
}
