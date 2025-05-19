import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * This is a simple Foo model class.
 */
@ObjectType()
export class Foo {
  /**
   * The ID of the Foo object.
   */
  @Field(() => Int)
  id: number;

  /**
   * The name of the Foo object.
   */
  @Field()
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
