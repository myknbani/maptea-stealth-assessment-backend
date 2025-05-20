import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Lead } from './models/lead.entity';
import { LeadInterest } from './models/lead-interest.entity';
import { ServiceType } from './models/dining-service-type.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      // entities and repositories needed for the module
      Lead,
      LeadInterest,
      ServiceType,
    ]),
  ],
})
export class LeadsModule {}
