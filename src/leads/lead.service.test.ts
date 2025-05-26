import { Test } from '@nestjs/testing';
import { RegisterLeadInput } from './models/register-lead.input';
import { LeadService } from './lead.service';
import { LeadRepository } from './lead.repository';
import { ServiceTypeRepository } from './service-type.repository';
import { Collection, EntityManager } from '@mikro-orm/postgresql';
import { Lead } from './models/lead.entity';
import { ServiceType } from './models/service-type.entity';
import { createMock } from '@golevelup/ts-jest';
import { ListLeadsInput } from './models/list-leads.input';

describe('LeadService', () => {
  let leadService: LeadService;
  let leadRepository: LeadRepository;
  let serviceTypeRepository: ServiceTypeRepository;
  let entityManager: EntityManager;

  const mockServices = [
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
  ];

  beforeEach(async () => {
    const mockMOdule = await Test.createTestingModule({
      providers: [LeadService],
    })
      .useMocker(createMock)
      .compile();

    leadRepository = mockMOdule.get(LeadRepository);
    serviceTypeRepository = mockMOdule.get(ServiceTypeRepository);
    entityManager = mockMOdule.get(EntityManager);

    leadService = mockMOdule.get(LeadService);
  });

  describe('#createLead', () => {
    it('creates a lead with the given input', async () => {
      // Arrange
      const lead = new RegisterLeadInput({
        email: 'mike@gmail.com',
        fullPhoneNumber: '639294584946',
        name: 'Mike',
        postCode: '1234',
        servicesInterestedIn: ['pick-up', 'delivery'],
      });

      const { servicesInterestedIn: servicesInterestedIn, ...profile } = lead;

      jest.spyOn(leadRepository, 'create').mockReturnValue(
        new Lead({
          ...profile,
          id: 1,
          createdAt: new Date('2025-05-05'),
          updatedAt: new Date('2025-05-05'),
          servicesInterestedIn: new Collection<ServiceType>([]),
        }),
      );

      jest.spyOn(serviceTypeRepository, 'find').mockResolvedValue(mockServices);

      // Act
      const result = await leadService.createLead(lead);

      // Assert
      expect(result).toEqual(
        new Lead({
          id: 1,
          ...profile,
          createdAt: new Date('2025-05-05'),
          updatedAt: new Date('2025-05-05'),
          servicesInterestedIn: new Collection(mockServices),
        }),
      );

      expect(leadRepository.create).toHaveBeenCalledWith(profile);
      expect(serviceTypeRepository.find).toHaveBeenCalledWith({
        name: { $in: servicesInterestedIn },
      });
      expect(entityManager.flush).toHaveBeenCalled();
    });
  });

  describe('#findAndCountLeads', () => {
    it('lists leads from the first page', async () => {
      // Arrange
      const paginationSettings = new ListLeadsInput({ page: 1, limit: 10 });

      const mockLeads = [
        new Lead({
          id: 1,
          email: 'mike@maptea.au',
          fullPhoneNumber: '639294584946',
          name: 'Mike',
          postCode: '1234',
          createdAt: new Date('2025-05-05'),
          updatedAt: new Date('2025-05-05'),
          servicesInterestedIn: new Collection<ServiceType>(['pick-up', 'delivery']),
        }),
        new Lead({
          id: 2,
          email: 'like@maptea.au',
          fullPhoneNumber: '639294584946',
          name: 'Like',
          postCode: '1234',
          createdAt: new Date('2025-05-05'),
          updatedAt: new Date('2025-05-05'),
          servicesInterestedIn: new Collection<ServiceType>(['pick-up', 'payment']),
        }),
      ];

      jest.spyOn(leadRepository, 'findAndCountLeads').mockResolvedValue([mockLeads, 2]);

      // Act
      const result = await leadService.findAndCountLeads(paginationSettings);

      // Assert
      expect(result).toEqual([mockLeads, 2]);
      expect(leadRepository.findAndCountLeads).toHaveBeenCalledWith(paginationSettings);
    });

    it('lists leads from the second page with a different limit', async () => {
      // Arrange
      const paginationSettings = new ListLeadsInput({ page: 2, limit: 5 });

      const mockLeads = [
        new Lead({
          id: 1,
          email: 'testuser@example.com',
          fullPhoneNumber: '639294584946',
          name: 'Test User',
          postCode: '1234',
          createdAt: new Date('2025-05-05'),
          updatedAt: new Date('2025-05-05'),
          servicesInterestedIn: new Collection<ServiceType>(['pick-up', 'delivery']),
        }),
      ];

      jest.spyOn(leadRepository, 'findAndCountLeads').mockResolvedValue([mockLeads, 1]);

      // Act
      const result = await leadService.findAndCountLeads(paginationSettings);

      // Assert
      expect(result).toEqual([mockLeads, 1]);
      expect(leadRepository.findAndCountLeads).toHaveBeenCalledWith(paginationSettings);
    });
  });

  describe('#getLead', () => {
    it('returns a lead with the given id', async () => {
      // Arrange
      const leadId = 1;
      const mockLead = new Lead({
        id: leadId,
        email: 'testuser@example.com',
        fullPhoneNumber: '639294584946',
        name: 'Test User',
        postCode: '1234',
        createdAt: new Date('2025-05-05'),
        updatedAt: new Date('2025-05-05'),
        servicesInterestedIn: new Collection<ServiceType>(['pick-up', 'delivery']),
      });

      jest.spyOn(leadRepository, 'findOneOrFail').mockResolvedValue(mockLead);

      // Act
      const result = await leadService.getLead(leadId);

      // Assert
      expect(result).toEqual(mockLead);
      expect(leadRepository.findOneOrFail).toHaveBeenCalledWith(
        { id: leadId },
        { populate: ['servicesInterestedIn'] },
      );
    });
  });
});
