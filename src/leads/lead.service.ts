import { Injectable } from '@nestjs/common';
import { LeadRepository } from './lead.repository';
import { ServiceTypeRepository } from './service-type.repository';
import { Lead } from './models/lead.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { RegisterLeadInput } from './models/register-lead.input';

@Injectable()
export class LeadService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly serviceTypeRepository: ServiceTypeRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async createLead(leadInput: RegisterLeadInput): Promise<Lead> {
    const { servicesInterests, ...profile } = leadInput;
    const lead = this.leadRepository.create(profile as Lead);

    const serviceTypes = await this.serviceTypeRepository.find({
      name: { $in: servicesInterests },
    });
    lead.servicesInterests.set(serviceTypes);

    await this.entityManager.flush();
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return await this.leadRepository.findAll();
  }
}
