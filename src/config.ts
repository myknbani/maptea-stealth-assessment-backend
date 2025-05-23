import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Config {
  constructor(private readonly configService: ConfigService<Record<string, any>, true>) {}

  get port(): number {
    return this.configService.get('PORT', { infer: true }) ?? 3001;
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL', { infer: true });
  }
  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET', { infer: true });
  }

  jwtExpiration: '1h';
}
