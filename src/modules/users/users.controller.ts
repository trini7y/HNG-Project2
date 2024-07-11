import { Controller, Get, Param, Req, UseGuards} from "@nestjs/common";
import { UserService } from "./users.service";
import { OrganisationService } from "../organisation/organisation.service";
import { AuthGuard } from "src/auth/guards/jwt-auth.guard";



@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService, 
    private readonly organisationService: OrganisationService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserData(@Param('id') userId: string, @Req() req) {
    const requestingUserId = req.user['userId'];

    if (requestingUserId === userId) {
      const user = await this.userService.getUserById(userId);
      return {
        status: 'success',
        message: 'User data fetched successfully',
        data: {
          userId: user.userId,
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          phone: user.phone,
        },
      };
    }
    const organisations = await this.organisationService.getUserOrganisation(requestingUserId);
    const isInSameOrganisation = organisations.some(org =>
      org.users.some(user => user.userId === userId),
    );

    if (isInSameOrganisation) {
      const user = await this.userService.getUserById(userId);
      return {
        status: 'success',
        message: 'User organisation data fetched successfully',
        data: {
          userId: user.userId,
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          phone: user.phone,
        },
      };
    }
  }
}