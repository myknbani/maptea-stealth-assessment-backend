import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Lead } from './models/lead.entity';
import { LeadInterest } from './models/lead-interest.entity';
import { ServiceType } from './models/service-type.entity';
import { LeadService } from './lead.service';
import { LeadResolver } from './lead.resolver';
import { AuthModule } from '../auth/auth.module';
import { AppConfigModule } from '../app-config/app-config.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      // entities and repositories needed for the module
      Lead,
      LeadInterest,
      ServiceType,
    ]),
    AuthModule,
  ],
  providers: [LeadService, LeadResolver],
})
export class LeadsModule {}
