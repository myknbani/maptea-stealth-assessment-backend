import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Lead } from './models/lead.entity';
import { LeadService } from './lead.service';
import { Query } from '@nestjs/graphql';
import { ListLeadsInput } from './models/list-leads.input';
import { RegisterLeadInput } from './models/register-lead.input';
import { ServiceType } from './models/service-type.entity';

@Resolver(() => Lead)
export class LeadResolver {
  constructor(private readonly leadService: LeadService) {}

  @Query(() => [Lead], { name: 'leads' })
  async getLeads(@Args('listLeadsInput') listLeadsInput: ListLeadsInput): Promise<Lead[]> {
    return await this.leadService.getLeads(listLeadsInput);
  }

  @Mutation(() => Lead, { name: 'createLead' })
  async createLead(@Args('registerLeadInput') leadInput: RegisterLeadInput): Promise<Lead> {
    return await this.leadService.createLead(leadInput);
  }

  @ResolveField(() => [ServiceType])
  async servicesInterests(@Parent() lead: Lead) {
    return await lead.servicesInterests.load();
  }
}
