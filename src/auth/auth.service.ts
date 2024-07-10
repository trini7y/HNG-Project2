import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from 'src/libs/dto/login.dto';
import { userDto } from 'src/libs/dto/user.dto';
import { User } from 'src/libs/entities/users/users.entity';
import { UserService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { OrganisationService } from 'src/modules/organisation/organisation.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({email, password}: loginDto) {
    console.log('payload', email, password);
    let response: object;
    try{
      if (email && password) {
      const user = await this.userService.findByEmail(email)

      console.log(user);
      console.log('Password', password, 'User Hash', user.password);
      if (user &&  await bcrypt.compare(password, user.password)) {
        console.log('In the if statement to validate');
        const { password, ...result } = user;
        const accessToken = this.jwtService.sign(result);
        response = {
            status: 'success',
            message: 'Login successful',
            data: {
              accessToken: accessToken,
              user: {
                userId: result.userId,
                firstname: result.firstName,
                lastName: result.lastName,
                email: result.email,
                phone: result.phone,
              },
            },
          };
          return response;
      }
    }
    }catch(error){

    }

    return null;
  }

  //   async login(payload: loginDto) {
  //     return {
  //       access_token: this.jwtService.sign(payload),
  //     };
  //   }

  async register(payload: userDto) {
    const accessToken = this.jwtService.sign(payload);
    return this.userService.createUser(payload, accessToken);
  }
}
