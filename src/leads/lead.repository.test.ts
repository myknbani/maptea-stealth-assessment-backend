import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { LeadRepository } from './lead.repository';
import { Lead } from './models/lead.entity';
import { ListLeadsInput } from './models/list-leads.input';

describe('LeadRepository', () => {
  let leadRepository: LeadRepository;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const mockModule = await Test.createTestingModule({
      providers: [
        LeadRepository,
        {
          provide: EntityManager,
          useValue: {
            // this cannot be mocked by createMock for some reason
            findAndCount: jest.fn(),
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    entityManager = mockModule.get(EntityManager);
    leadRepository = new LeadRepository(entityManager, Lead); // cannot use module.get(...) here
  });

  describe('#findAndCountLeads', () => {
    it('returns a list of leads from the first page', async () => {
      // Arrange
      const listLeadsInput = new ListLeadsInput({ page: 1, limit: 2 });
      const leads = [
        new Lead({
          id: 1,
          email: 'mike@maptea.au',
          fullPhoneNumber: '639294584946',
          name: 'Mike',
          postCode: '1234',
          createdAt: new Date('2025-05-05'),
          updatedAt: new Date('2025-05-05'),
        }),
        new Lead({
          id: 2,
          email: 'like@maptea.au',
          fullPhoneNumber: '639294584946',
          name: 'Like',
          postCode: '1234',
          createdAt: new Date('2025-05-05'),
          updatedAt: new Date('2025-05-05'),
        }),
      ];

      jest.spyOn(entityManager, 'findAndCount').mockResolvedValue([leads, 2]);

      // Act
      const result = await leadRepository.findAndCountLeads(listLeadsInput);
      // Assert
      expect(result).toEqual([leads, 2]);
      expect(entityManager.findAndCount).toHaveBeenCalledWith(
        Lead,
        {},
        {
          limit: 2,
          offset: 0,
        },
      );
    });

    it('calculates the correct offset of page 3 when given a different limit', async () => {
      // Arrange
      const listLeadsInput = new ListLeadsInput({ page: 3, limit: 5 });
      const leads = [
        new Lead({
          id: 1,
          email: 'mike@maptea.au',
          fullPhoneNumber: '639294584946',
          name: 'Mike',
          postCode: '1234',
          createdAt: new Date('2025-05-05'),
          updatedAt: new Date('2025-05-05'),
        }),
      ];

      jest.spyOn(entityManager, 'findAndCount').mockResolvedValue([leads, 1]);

      // Act
      const result = await leadRepository.findAndCountLeads(listLeadsInput);

      // Assert
      expect(result).toEqual([leads, 1]);
      expect(entityManager.findAndCount).toHaveBeenCalledWith(
        Lead,
        {},
        {
          limit: 5,
          offset: 10,
        },
      );
    });
  });
});
