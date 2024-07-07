import { Body, Controller, Post } from '@nestjs/common';
import { OrganisationService } from './organisation.service';

@Controller('organisation')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

//   @Post('/auth/register')
//   async createUser(@Body() payload: userDto): Promise<User> {
//     return this.userService.createUser(payload);
//   }
}
