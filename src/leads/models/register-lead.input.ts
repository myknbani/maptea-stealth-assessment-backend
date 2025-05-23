import { InputType, OmitType } from '@nestjs/graphql';
import { Lead } from './lead.entity';
import { ArrayMinSize, IsString } from 'class-validator';

@InputType()
export class RegisterLeadInput extends OmitType(
  Lead,
  ['id', 'createdAt', 'updatedAt', 'servicesInterestedIn'],
  InputType,
) {
  /**
   * The list of service interests names for the lead.
   */
  @IsString({ each: true })
  @ArrayMinSize(1)
  servicesInterestedIn: string[];

  constructor(data: RegisterLeadInput) {
    super();
    Object.assign(this, data);
  }
}
