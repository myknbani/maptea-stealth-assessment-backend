import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from './models/user.entity';
import { createMock } from '@golevelup/ts-jest';

import bcrypt from 'bcryptjs';

jest.mock(
  'bcryptjs',
  () =>
    ({
      ...jest.requireActual('bcryptjs'),
      compare: jest.fn(),
      hash: jest.fn().mockResolvedValue('$2b$10$Psdx5Q1Z2Y8e4a0c3b6e7uO'),
    }) as typeof bcrypt,
);

describe('AuthService', () => {
  describe('#login', () => {
    let authService: AuthService;
    let userRepository: UserRepository;
    let jwtService: JwtService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [AuthService],
      })
        .useMocker(createMock)
        .compile();

      authService = module.get(AuthService);
      userRepository = module.get(UserRepository);
      jwtService = module.get(JwtService);
    });

    it('returns a JWT token when credentials are valid', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'password123';
      const user = new User({
        id: 1,
        username,
        hashedPassword: '$2b$10$Psdx5Q1Z2Y8e4a0c3b6e7uO',
      });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiO' +
            'jE2MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        );

      // Act
      const result = await authService.login(username, password);

      // Assert
      expect(result).toEqual({
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInV' +
          'zZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE2MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({ username });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.hashedPassword);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
      });
    });
  });
});
