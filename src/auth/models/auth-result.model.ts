import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResult {
  accessToken: string;
}
