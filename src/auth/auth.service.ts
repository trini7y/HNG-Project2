import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from 'src/libs/dto/login.dto';
import { userDto } from 'src/libs/dto/user.dto';
import { UserService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login({email, password}: loginDto) {
    let response: object;
    try {
      if (email && password) {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
          const { password, ...result } = user;
          const accessToken = this.jwtService.sign(result);
          response = {
            status: 'success',
            message: 'Login successful',
            data: {
              accessToken: accessToken,
              user: {
                userId: result.userId,
                firstname: result.firstname,
                lastname: result.lastname,
                email: result.email,
                phone: result.phone,
              },
            },
          };
          return response;
        }
      }
    } catch (error) {
      response = {
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      };
      return response;
    }

    return null;
  }

  async register(payload: userDto) {
    const accessToken = this.jwtService.sign(payload);
    return this.userService.createUser(payload, accessToken);
  }
}
