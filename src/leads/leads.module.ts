import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Lead } from './models/lead.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      // entities and repositories needed for the module
      Lead,
    ]),
  ],
})
export class LeadsModule {}
