import { EntityRepository } from '@mikro-orm/postgresql';
import { Lead } from './models/lead.entity';
import { ListLeadsInput } from './models/list-leads.input';

/**
 * Custom repository for the Lead entity.
 */
export class LeadRepository extends EntityRepository<Lead> {
  /**
   * Lists leads with pagination.
   *
   * @param listLeadsInput - The pagination and filtering options.
   * @returns A promise that resolves to an array of leads.
   */
  async findAndCountLeads(listLeadsInput: ListLeadsInput) {
    const { page, limit } = listLeadsInput;
    const offset = (page - 1) * limit;
    const leads = await this.findAndCount({}, { limit, offset });
    return leads;
  }
}
