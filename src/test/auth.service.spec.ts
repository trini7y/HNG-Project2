import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockUser = {
    userId: 1,
    firstname: 'Desmond',
    lastname: 'Okeke',
    email: 'desmond@gmail.com',
    password: 'hashedPassword',
    phone: '1234567890',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  (bcrypt.compare as jest.Mock).mockImplementation(
    (password, hashedPassword) => {
      return password === 'password' && hashedPassword === 'hashedPassword';
    },
  );

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should generate a token with correct payload and expiration', async () => {
    const loginDto = { email: 'desmond@gmail.com', password: 'password' };
    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const token = 'mocked-jwt-token';
    (jwtService.sign as jest.Mock).mockReturnValue(token);

    const result = await authService.login(loginDto);

    expect(result).toEqual({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: mockUser.userId,
          firstname: mockUser.firstname,
          lastname: mockUser.lastname,
          email: mockUser.email,
          phone: mockUser.phone,
        },
      },
    });

    expect(userService.findByEmail).toHaveBeenCalledWith('desmond@gmail.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    expect(jwtService.sign).toHaveBeenCalledWith({
      userId: mockUser.userId,
      firstname: mockUser.firstname,
      lastname: mockUser.lastname,
      email: mockUser.email,
      phone: mockUser.phone,
    });
  });

  it('should return null if email or password is missing', async () => {
    const loginDto = { email: '', password: 'password' };
    const result = await authService.login(loginDto);
    expect(result).toBeNull();
  });
});
