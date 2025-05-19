// hello.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';
import { Foo } from './foo.model';

@Resolver()
export class AppResolver {
  /**
   * This query returns a simple string -- "Hello, world!".
   *
   * @returns A string "Hello, world!".
   */
  @Query(() => String, {
    description: 'A simple hello world query',
  })
  hello() {
    return 'Hello, world!';
  }

  /**
   * This query returns a Foo object with id 1 and name "Hello, world!".
   *
   * @returns A Foo object with id 1 and name "Hello, world!".
   */
  @Query(() => Foo)
  getFoo(): Foo {
    return new Foo(1, 'Hello, world!');
  }
}
