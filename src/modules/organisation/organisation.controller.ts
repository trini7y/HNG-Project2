import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOrganisationDto } from 'src/libs/dto/create-organisation.dto';

@Controller('api/organisation')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUserOrganizations(@Req() req) {
    const userId = req.user['userId'];
    const organisations =
      await this.organisationService.getUserOrganisation(userId);
    return {
      status: 'success',
      message: 'Organisations fetched successfully',
      data: {
        organisations: organisations.map((org) => ({
          orgId: org.orgId,
          name: org.name,
          description: org.description,
        })),
      },
    };
  }

  @Get(':orgId')
  @UseGuards(AuthGuard)
  async getOrganisation(@Param('orgId') orgId: string, @Req() req) {
    const user = req.user['userId'];
    const organisation = await this.organisationService.getOrganisationById(
      orgId,
      user,
    );
    return {
      status: 'success',
      message: 'Organisation data fetched successfully',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  async createOrganisation(
    @Body() createOrganisationDto: CreateOrganisationDto,
    @Req() req,
  ) {
  try{
      const userId = req.user['userId'];
    const organisation = await this.organisationService.create(
      createOrganisationDto,
      userId,
    );

    return {
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    };
  }catch(error){
      return {
        status: 'Bad Request',
        message: 'Client error',
        statusCode: 400,
      };
    }
  }

  @Post(':orgId/users')
  async addUserToOrganisation(
    @Param('orgId') orgId: string,
    @Body('userId') userId: string,
  ) {
    try {
      return await this.organisationService.addUserToOrganisation(orgId, userId);

     }catch (error) {
      return{
        status: 'error',
        message: error.message,
      }
    }
  }
}
