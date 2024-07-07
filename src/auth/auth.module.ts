import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/users/users.module';
import 'dotenv/config';

@Module({
  imports: [

    UserModule,
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60m' },
      }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
