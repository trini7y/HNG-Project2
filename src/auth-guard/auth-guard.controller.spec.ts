import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuardController } from './auth-guard.controller';

describe('AuthGuardController', () => {
  let controller: AuthGuardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGuardController],
    }).compile();

    controller = module.get<AuthGuardController>(AuthGuardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
