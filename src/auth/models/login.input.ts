import { InputType } from '@nestjs/graphql';

/**
 * An input type for login.
 */
@InputType()
export class LoginInput {
  /**
   * The username of the user.
   */
  username: string;

  /**
   * The password of the user.
   */
  password: string;
}
