import { Module } from '@nestjs/common';
import { AuthGuardService } from './auth-guard.service';
import { AuthGuardController } from './auth-guard.controller';

@Module({
  providers: [AuthGuardService],
  controllers: [AuthGuardController]
})
export class AuthGuardModule {}
