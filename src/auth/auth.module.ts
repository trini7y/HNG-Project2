import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/users/users.module';
import 'dotenv/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
// import { AuthGuard } from './guards/jwt-auth.guard';
// import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/libs/entities/users/users.entity';
import { OrganisationModule } from 'src/modules/organisation/organisation.module';

@Module({
  imports: [
    UserModule,
    OrganisationModule,
    // TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    // PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
     JwtStrategy,
    //  PassportModule
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
