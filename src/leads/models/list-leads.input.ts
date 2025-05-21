import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ListLeadsInput {
  @Field(() => Int)
  page: number = 1;

  @Field(() => Int)
  limit: number = 10;

  constructor(data: Partial<ListLeadsInput>) {
    Object.assign(this, data);
  }
}
