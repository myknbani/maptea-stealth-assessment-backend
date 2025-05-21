import { Args, Resolver } from '@nestjs/graphql';
import { Lead } from './models/lead.entity';
import { LeadService } from './lead.service';
import { Query } from '@nestjs/graphql';
import { ListLeadsInput } from './models/list-leads.input';

@Resolver(() => Lead)
export class LeadResolver {
  constructor(private readonly leadService: LeadService) {}

  @Query(() => [Lead], { name: 'leads' })
  async getLeads(@Args('listLeadsInput') listLeadsInput: ListLeadsInput): Promise<Lead[]> {
    return await this.leadService.getLeads(listLeadsInput);
  }
}
