import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './models/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
})
export class AuthModule {}
