import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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

  
  async createOrganisation(creator: User, name: string, description?: string){
         const organisation = this.organisationRepository.create({
           name,
           description,
           creator
         });
         organisation.users = [creator];
         return this.organisationRepository.save(organisation);
  }
}
