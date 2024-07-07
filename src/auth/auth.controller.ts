import { Body, Controller, Post } from '@nestjs/common';
import { userDto } from 'src/libs/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    async register(@Body() payload: userDto){
        return this.authService.register(payload)
    }
}
