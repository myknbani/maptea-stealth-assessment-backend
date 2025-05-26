import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { LeadRepository } from './lead.repository';
import { ServiceTypeRepository } from './service-type.repository';
import { Lead } from './models/lead.entity';
import { EntityManager, UniqueConstraintViolationException } from '@mikro-orm/postgresql';
import { RegisterLeadInput } from './models/register-lead.input';
import { ListLeadsInput } from './models/list-leads.input';

/**
 * Service for managing leads.
 */
@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly serviceTypeRepository: ServiceTypeRepository,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Creates a new lead.
   *
   * @param leadInput - The input data for the lead.
   * @returns A promise that resolves to the created lead.
   */
  async createLead(leadInput: RegisterLeadInput): Promise<Lead> {
    try {
      this.logger.log(`Creating lead with input: ${JSON.stringify(leadInput)}`);

      const { servicesInterestedIn: servicesInterestedIn, ...profile } = leadInput;
      const lead = this.leadRepository.create(profile as Lead);

      const serviceTypes = await this.serviceTypeRepository.find({
        name: { $in: servicesInterestedIn },
      });
      lead.servicesInterestedIn.set(serviceTypes);
      this.logger.debug(`Creating lead with services: ${JSON.stringify(lead)}`);

      await this.entityManager.flush();
      this.logger.log(`Lead created successfully: ${JSON.stringify(lead)}`);
      return lead;
    } catch (error) {
      // TODO: ideally we would handle this via Exception Filters of NestJS

      if (error instanceof UniqueConstraintViolationException) {
        this.logger.error(`Duplicate lead registered: ${error.message}`);
        throw new ConflictException('Lead with the same email already exists.');
      }

      this.logger.error(`Error creating lead: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Lists leads with pagination.
   *
   * @param listLeadsInput - The pagination and filtering options.
   * @returns A promise that resolves to an array of leads.
   */
  async findAndCountLeads(listLeadsInput: ListLeadsInput): Promise<[Lead[], number]> {
    return await this.leadRepository.findAndCountLeads(listLeadsInput);
  }

  /**
   * Retrieves a lead by its ID.
   *
   * @param leadId - The ID of the lead to retrieve.
   * @returns A promise that resolves to the lead.
   */
  async getLead(leadId: number): Promise<Lead> {
    const lead = await this.leadRepository.findOneOrFail(
      { id: leadId },
      { populate: ['servicesInterestedIn'] },
    );
    this.logger.log(`Lead found: ${JSON.stringify(lead)}`);
    return lead;
  }
}
