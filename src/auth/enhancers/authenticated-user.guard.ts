import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticatedUserGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const graphqlContext = GqlExecutionContext.create(context);
    const { req: request } = graphqlContext.getContext<{ req: Request }>();
    this.logger.debug(`Checking authentication for request: ${JSON.stringify(request.headers)}`);
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided, or invalid token format.');
    }

    const user = await this.authService.verifyToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = user;
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    this.logger.debug(`xtracting headers from request: ${JSON.stringify(request.headers)}`);
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return undefined;
    }

    const [prefix, token] = authHeader.split(' ');
    return prefix === 'Bearer' ? token : undefined;
  }
}
