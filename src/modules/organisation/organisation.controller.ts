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
    const userId = req.user['userId'];
    const organisations =  await this.organisationService.getUserOrganisation(userId);
     return {
      status: 'success',
      message: 'Organisations fetched successfully',
      data: {
        organisations: organisations.map(org => ({
          orgId: org.orgId,
          name: org.name,
          description: org.description,
        })),
      },
    };
  }
}
