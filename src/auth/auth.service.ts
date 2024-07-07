import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userDto } from 'src/libs/dto/user.dto';
import { User } from 'src/libs/entities/users/users.entity';
import { UserService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ){}

    async register(payload: userDto){
         const accessToken = this.jwtService.sign(payload);
        return this.userService.createUser(payload, accessToken);
    }
}
