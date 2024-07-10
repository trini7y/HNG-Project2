import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOrganisationDto } from "src/libs/dto/create-organisation.dto";
import { OrganisationDto } from "src/libs/dto/organization.dto";
import { Organisation } from "src/libs/entities/organisation.entity";
import { User } from "src/libs/entities/users/users.entity";
import { Repository } from "typeorm";


@Injectable()
export class OrganisationService {
  constructor(
    @InjectRepository(Organisation)
    private organisationRepository: Repository<Organisation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrganisation(creator: User, name: string, description?: string) {
    const organisation = this.organisationRepository.create({
      name,
      description,
      creator,
    });
    organisation.users = [creator];
    return this.organisationRepository.save(organisation);
  }

  async getUserOrganisation(userId) {
    const getUserOrganisation = await this.organisationRepository
      .createQueryBuilder('organisation')
      .leftJoinAndSelect('organisation.users', 'user')
      .leftJoinAndSelect('organisation.creator', 'creator')
      .where('user.userId = :userId OR creator.userId = :userId', {
        userId: userId,
      })
      .getMany();
    return getUserOrganisation;
  }

  async getOrganisationById(
    orgId: string,
    userId: string,
  ): Promise<Organisation> {
    const organisation = await this.organisationRepository
      .createQueryBuilder('organisation')
      .leftJoinAndSelect('organisation.creator', 'creator')
      .leftJoinAndSelect('organisation.users', 'user')
      .where('organisation.orgId = :orgId', { orgId: orgId })
      .andWhere('creator.userId = :userId', { userId: userId })
      .getOne();

    if (!organisation) {
      throw new NotFoundException(
        'Organisation not found or you do not have access',
      );
    }

    return organisation;
  }

  async create(
    createOrganisationDto: CreateOrganisationDto,
    userId: string,
  ): Promise<Organisation> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new Error(`User with id ${userId} not found.`);
    }
    const { name, description } = createOrganisationDto;

    const organisation = new Organisation();
    organisation.name = name;
    organisation.description = description;
    organisation.creator = user;

    await this.organisationRepository.save(organisation);

    return organisation;
  }
}
