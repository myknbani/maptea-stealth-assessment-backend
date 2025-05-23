import { createMock } from '@golevelup/ts-jest';
import { LeadResolver } from './lead.resolver';
import { LeadService } from './lead.service';
import { Test } from '@nestjs/testing';
import { RegisterLeadInput } from './models/register-lead.input';
import { Lead } from './models/lead.entity';
import { ListLeadsInput } from './models/list-leads.input';
import { Collection } from '@mikro-orm/core';
import { ServiceType } from './models/service-type.entity';

describe('LeadResolver', () => {
  let leadResolver: LeadResolver;
  let leadService: LeadService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LeadResolver],
    })
      .useMocker(createMock)
      .compile();

    leadResolver = module.get<LeadResolver>(LeadResolver);
    leadService = module.get<LeadService>(LeadService);
  });

  describe('#createLead', () => {
    it('creates a lead with the given input', async () => {
      // Arrange
      const leadInput = new RegisterLeadInput({
        email: 'mike@gmail.com',
        fullPhoneNumber: '639294584946',
        name: 'Mike',
        postCode: '1234',
        servicesInterests: ['pick-up', 'delivery'],
      });

      const { servicesInterests: _, ...profile } = leadInput;
      const mockLead = new Lead({
        ...profile,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        servicesInterests: new Collection([
          new ServiceType({
            id: 1,
            name: 'pick-up',
            createdAt: new Date('2025-05-05'),
            updatedAt: new Date('2025-05-05'),
          }),
          new ServiceType({
            id: 2,
            name: 'delivery',
            createdAt: new Date('2025-05-05'),
            updatedAt: new Date('2025-05-05'),
          }),
        ]),
      });
      jest.spyOn(leadService, 'createLead').mockResolvedValue(mockLead);

      // Act
      const result = await leadResolver.createLead(leadInput);

      // Assert
      expect(result).toEqual(mockLead);
      expect(leadService.createLead).toHaveBeenCalledWith(leadInput);
    });
  });

  describe('#getLeads', () => {
    it('returns a list of leads', async () => {
      // Arrange
      const paginationSettings = new ListLeadsInput({ page: 1, limit: 10 });
      const mockLeads = [new Lead({ id: 1, email: 'mike@gmail.com' })];

      jest.spyOn(leadService, 'getLeads').mockResolvedValue(mockLeads);

      // Act
      const result = await leadResolver.getLeads(paginationSettings);

      // Assert
      expect(result).toEqual(mockLeads);
      expect(leadService.getLeads).toHaveBeenCalledWith(paginationSettings);
    });
  });

  describe('#getLead', () => {
    it('returns a lead with the given id', async () => {
      // Arrange
      const leadId = 1;
      const mockLead = new Lead({ id: leadId, email: 'mike@gmail.com' });

      jest.spyOn(leadService, 'getLead').mockResolvedValue(mockLead);

      // Act
      const result = await leadResolver.getLead(leadId);

      // Assert
      expect(result).toEqual(mockLead);
      expect(leadService.getLead).toHaveBeenCalledWith(leadId);
    });
  });
});
