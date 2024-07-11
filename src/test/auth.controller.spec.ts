import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let app: INestApplication;
  let moduleFixture: TestingModule;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({
      accessToken: 'mockToken',
      user: {
        userId: 1,
        firstName: 'Desmond',
        lastName: 'Okeke',
        email: 'desmond@gmail.com',
        password: 'password',
        phone: '1234567890',
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        JwtService,
        Reflector,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  
});
