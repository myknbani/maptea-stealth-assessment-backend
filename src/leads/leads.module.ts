import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Lead } from './models/lead.entity';
import { LeadInterest } from './models/lead-interest.entity';
import { ServiceType } from './models/service-type.entity';
import { LeadService } from './lead.service';
import { LeadResolver } from './lead.resolver';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      // entities and repositories needed for the module
      Lead,
      LeadInterest,
      ServiceType,
    ]),
  ],
  providers: [LeadService, LeadResolver],
})
export class LeadsModule {}
