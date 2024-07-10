import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('organisation')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  //   @Post('/auth/register')
  //   async createUser(@Body() payload: userDto): Promise<User> {
  //     return this.userService.createUser(payload);
  //   }
  @Get()
  @UseGuards(AuthGuard)
  async getUserOrganizations(@Req() req) {
    console.log('request',req);
    const userId = req.user.id;
    console.log(req)
    return await this.organisationService.getUserOrganisation(userId);
  }
}
