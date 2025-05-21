import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthResult } from './models/auth-result.model';
import { AuthService } from './auth.service';
import { LoginInput } from './models/login.input';

@Resolver(() => AuthResult)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResult)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResult> {
    const { username, password } = loginInput;
    return await this.authService.login(username, password);
  }
}
