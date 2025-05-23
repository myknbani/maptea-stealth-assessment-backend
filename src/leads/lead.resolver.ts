import { Args, Int, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Lead } from './models/lead.entity';
import { LeadService } from './lead.service';
import { Query } from '@nestjs/graphql';
import { ListLeadsInput } from './models/list-leads.input';
import { RegisterLeadInput } from './models/register-lead.input';
import { ServiceType } from './models/service-type.entity';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedUserGuard } from '../auth/enhancers/authenticated-user.guard';

/**
 * The resolver for lead-related operations.
 */
@Resolver(() => Lead)
export class LeadResolver {
  constructor(private readonly leadService: LeadService) {}

  @Query(() => [Lead], {
    name: 'leads',
    description:
      'Retrieve a page of leads. This has no authentication for demo purposes, if it creates ' +
      'friction for the exercise.',
  })
  async getLeads(@Args('listLeadsInput') listLeadsInput: ListLeadsInput): Promise<Lead[]> {
    return await this.leadService.getLeads(listLeadsInput);
  }

  @Query(() => Lead, {
    name: 'lead',
    description: 'Get a lead by its ID, also has no auth for demo purposes.',
  })
  async getLead(@Args({ name: 'id', type: () => Int }) id: number): Promise<Lead> {
    return await this.leadService.getLead(id);
  }

  @UseGuards(AuthenticatedUserGuard)
  @Query(() => [Lead], {
    name: 'authenticatedLeads',
    description:
      'A demo endpoint to show that GraphQL operations can be protected. Aside from requiring a ' +
      'Bearer token, this is exactly identical to the `leads` query.',
  })
  async getAuthenticatedLeads(
    @Args('listLeadsInput') listLeadsInput: ListLeadsInput,
  ): Promise<Lead[]> {
    return await this.leadService.getLeads(listLeadsInput);
  }

  @Mutation(() => Lead, { name: 'createLead', description: 'Create a new lead.' })
  async createLead(@Args('registerLeadInput') leadInput: RegisterLeadInput): Promise<Lead> {
    return await this.leadService.createLead(leadInput);
  }

  /**
   * This documentatotion is not visible in GraphiQL.
   *
   * An observation: the ORM currently produces a seemingly inefficient query, using both a series
   * of `OR` and an `IN (...)`. It could be a bug, but something the query planner may be able to
   * optimize.
   *
   * ```sql
   * SELECT
   *   "s1".*,
   *   "l0"."service_type_id" AS "fk__service_type_id",
   *   "l0"."lead_id" AS "fk__lead_id"
   * FROM
   *   "lead_interest" AS "l0"
   *   INNER JOIN "service_type" AS "s1" ON "l0"."service_type_id" = "s1"."id"
   * WHERE (("l0"."lead_id" = 1)
   *   OR ("l0"."lead_id" = 2)
   *   OR ("l0"."lead_id" = 6)
   *   OR ("l0"."lead_id" = 7)
   *   OR ("l0"."lead_id" = 8)
   *   OR ("l0"."lead_id" = 9))
   * AND "l0"."lead_id" IN (1, 2, 6, 7, 8, 9)
   * ORDER BY
   *   "l0"."id" ASC[took 2 ms, 5 results]
   * ```
   */
  @ResolveField(() => [ServiceType])
  async servicesInterestedIn(@Parent() lead: Lead) {
    return await lead.servicesInterestedIn.load();
  }
}
