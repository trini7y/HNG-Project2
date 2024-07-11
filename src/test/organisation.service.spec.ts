import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationService } from 'src/modules/organisation/organisation.service';
import { Organisation } from 'src/libs/entities/organisation.entity';
import { User } from 'src/libs/entities/users/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('OrganisationService', () => {
  let service: OrganisationService;
  let organisationRepository: Repository<Organisation>;
  let userRepository: Repository<User>;

  const mockOrganisationRepository = {
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    })),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganisationService,
        {
          provide: getRepositoryToken(Organisation),
          useValue: mockOrganisationRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<OrganisationService>(OrganisationService);
    organisationRepository = module.get<Repository<Organisation>>(
      getRepositoryToken(Organisation),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrganisationById', () => {
    it('should return the organisation if the user has access', async () => {
      const mockUser = {
        userId: '1',
        firstname: 'Desmond',
        lastname: 'Okeke',
        email: 'desmond@gmail.com',
        password: 'hashedPassword',
        phone: '1234567890',
      };
      const mockOrganisation = {
        orgId: '1',
        name: 'Org 1',
        creator: mockUser,
        users: [mockUser],
      };

      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockOrganisation),
      };

      mockOrganisationRepository.createQueryBuilder.mockReturnValue(
        queryBuilderMock,
      );

      const result = await service.getOrganisationById('1', '1');

      expect(result).toEqual(mockOrganisation);
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'organisation.orgId = :orgId',
        { orgId: '1' },
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'creator.userId = :userId',
        { userId: '1' },
      );
    });

    it('should throw NotFoundException if the user does not have access to the organisation', async () => {
      const mockUser = {
        userId: 2,
        firstname: 'Elly',
        lastname: 'Kane',
        email: 'elly@gmail.com',
        password: 'hashedPassword',
        phone: '1234567890',
      };
      const mockOrganisation = {
        orgId: '1',
        name: 'Org 1',
        creator: mockUser,
        users: [mockUser],
      };

      mockOrganisationRepository
        .createQueryBuilder()
        .getOne.mockResolvedValue(mockOrganisation);

      try {
        await service.getOrganisationById('1', '1');
        throw new NotFoundException();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Not Found');
      }

    });

  });
});
