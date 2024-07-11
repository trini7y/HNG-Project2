import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { userDto } from 'src/libs/dto/user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { loginDto } from 'src/libs/dto/login.dto';
import { AuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() payload: loginDto) {
    const user = this.authService.login(payload);
    if(!user) throw new HttpException('Invalid Credential', 401);
    return user
  }

  @Public()
  @Post('register')
  register(@Body() payload: userDto) {
    return this.authService.register(payload);
  }
}
