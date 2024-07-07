import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./users.service";
import { userDto } from "src/libs/dto/user.dto";
import { User } from "src/libs/entities/users/users.entity";



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/auth/register')
  async createUser(@Body() payload: userDto) {
    // return this.userService.createUser(payload);
  }
}