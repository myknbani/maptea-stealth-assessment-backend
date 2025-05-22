import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class ListLeadsInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  page: number = 1;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  limit: number = 10;

  constructor(data: Partial<ListLeadsInput>) {
    Object.assign(this, data);
  }
}
