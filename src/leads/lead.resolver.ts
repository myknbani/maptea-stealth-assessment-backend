import { Resolver } from '@nestjs/graphql';
import { Lead } from './models/lead.entity';
import { LeadService } from './lead.service';
import { Query } from '@nestjs/graphql';

@Resolver(() => Lead)
export class LeadResolver {
  constructor(private readonly leadService: LeadService) {}

  @Query(() => [Lead], { name: 'leads' })
  async getLeads(): Promise<Lead[]> {
    return await this.leadService.getLeads();
  }
}
