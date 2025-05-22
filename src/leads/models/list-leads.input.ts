import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

/**
 * An input type for listing leads.  Currently, it's only used for offset-based pagination.
 */
@InputType()
export class ListLeadsInput {
  /**
   * The page number to retrieve.
   */
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  page: number = 1;

  /**
   * The number of leads to retrieve per page.
   */
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  limit: number = 10;

  constructor(data: Partial<ListLeadsInput>) {
    Object.assign(this, data);
  }
}
