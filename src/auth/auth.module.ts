import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '../config';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { User } from './models/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [Config],
      useFactory: (config: Config) => ({
        secretOrPrivateKey: config.jwtSecret,
        signOptions: { expiresIn: config.jwtExpiration },
      }),
    }),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
