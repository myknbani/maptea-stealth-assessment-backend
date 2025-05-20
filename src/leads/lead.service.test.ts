import { Test } from '@nestjs/testing';
import { RegisterLeadInput } from './models/register-lead.input';
import { LeadService } from './lead.service';
import { LeadRepository } from './lead.repository';
import { ServiceTypeRepository } from './service-type.repository';
import { Collection, EntityManager } from '@mikro-orm/postgresql';
import { Lead } from './models/lead.entity';
import { ServiceType } from './models/service-type.entity';
import { createMock } from '@golevelup/ts-jest';

describe('LeadService', () => {
  describe('#createLead', () => {
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

    it('creates a lead with the given input', async () => {
      // Arrange
      const lead = new RegisterLeadInput({
        email: 'mike@gmail.com',
        fullPhoneNumber: '639294584946',
        name: 'Mike',
        postCode: '1234',
        servicesInterests: ['pick-up', 'delivery'],
      });

      const { servicesInterests, ...profile } = lead;

      jest.spyOn(leadRepository, 'create').mockReturnValue(
        new Lead({
          ...profile,
          id: 1,
          createdAt: new Date('2025-05-05'),
          updatedAt: new Date('2025-05-05'),
          servicesInterests: new Collection<ServiceType>([]),
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
          servicesInterests: new Collection(mockServices),
        }),
      );

      expect(leadRepository.create).toHaveBeenCalledWith(profile);
      expect(serviceTypeRepository.find).toHaveBeenCalledWith({
        name: { $in: servicesInterests },
      });
      expect(entityManager.flush).toHaveBeenCalled();
    });
  });
});
