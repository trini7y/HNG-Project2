import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/libs/entities/users/users.entity";
import { OrganisationModule } from "../organisation/organisation.module";


@Module({
  imports: [TypeOrmModule.forFeature([User]), OrganisationModule],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}