import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../entities/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((user) => Promise.resolve({ id: 1, ...user })),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully and return tokens', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.register(
        'Enzo Ferrari',
        'enzo@ferrari.it',
        'superpass123',
        UserRole.SELLER,
        '+39 0536 949111',
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'enzo@ferrari.it' } });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result.user.name).toBe('Enzo Ferrari');
      expect(result.user.email).toBe('enzo@ferrari.it');
      expect(result.user.role).toBe(UserRole.SELLER);
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.refreshToken).toBe('mock-jwt-token');
    });

    it('should throw ConflictException if email already registered', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 99, email: 'duplicate@ferrari.it' });

      await expect(
        service.register('Test', 'duplicate@ferrari.it', 'pass', UserRole.BUYER),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login valid user with correct password', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);
      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        name: 'Mikhail',
        email: 'mikhail@car.com',
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
      });

      const result = await service.login('mikhail@car.com', 'secret123');

      expect(result.user.id).toBe(1);
      expect(result.accessToken).toBe('mock-jwt-token');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login('notfound@car.com', 'secret123')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      mockUserRepository.findOne.mockResolvedValue({
        id: 2,
        email: 'user@car.com',
        passwordHash: hashedPassword,
      });

      await expect(service.login('user@car.com', 'wrong_password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should verify and issue new tokens for valid refresh token', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 5 });
      mockUserRepository.findOne.mockResolvedValue({
        id: 5,
        email: 'driver@f1.com',
        name: 'Charles Leclerc',
        role: UserRole.BUYER,
      });

      const result = await service.refreshToken('valid-token');
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.refreshToken).toBe('mock-jwt-token');
    });

    it('should throw UnauthorizedException on invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('expired');
      });

      await expect(service.refreshToken('bad-token')).rejects.toThrow(UnauthorizedException);
    });
  });
});
