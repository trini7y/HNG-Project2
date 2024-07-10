import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from "src/libs/entities/users/users.entity";
import { Organisation } from "src/libs/entities/organisation.entity";
import { userDto } from "src/libs/dto/user.dto";
import { OrganisationService } from "../organisation/organisation.service";


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private organisationService: OrganisationService,
  ) {}
  private readonly log = new Logger(UserService.name);
  async createUser(payload: userDto, accessToken: string) {
    let response: object;
    try {
      if (payload) {
        const checkEmail = await this.isEmailTaken(payload.email);

        if (checkEmail) {
          response = {
            status: 'Bad request',
            message: 'Email exists',
            statusCode: 400,
          };
        } else {
          payload.password = await this.hashPassword(payload.password);
          const newUser = this.userRepository.create(payload);
          const savedUser = await this.userRepository.save(newUser);
          await this.organisationService.createOrganisation(
            savedUser,
            `${payload.firstName}'s Organisation`,
          );

          console.log('Firstname', payload.firstName);
          this.log.debug(`Saved User ${savedUser.email}`);

          response = {
            status: 'success',
            message: 'Registration successful',
            data: {
              accessToken: accessToken,
              user: {
                userId: savedUser.userId,
                firstname: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                phone: savedUser.phone,
              },
            },
          };
        }
        return response;
      }
    } catch (error) {
      this.log.debug(`Something went wrong ${error}`);
      response = {
        status: 'Bad request',
        message: 'Registration unsuccessful',
        statusCode: 400,
      };
      return response;
    }
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async findByEmail(email: string): Promise<User> {
    console.log("From Find Email", email)
    const user =  await this.userRepository.createQueryBuilder("users")
            .where("users.email = :email", {email: email}).getOne();

    console.log('from find email', user)
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}