import { EntityRepository } from '@mikro-orm/postgresql';
import { Lead } from './models/lead.entity';
import { ListLeadsInput } from './models/list-leads.input';

export class LeadRepository extends EntityRepository<Lead> {
  async listLeads(listLeadsInput: ListLeadsInput) {
    const { page, limit } = listLeadsInput;
    const offset = (page - 1) * limit;
    const leads = await this.findAll({ limit, offset });
    return leads;
  }
}
