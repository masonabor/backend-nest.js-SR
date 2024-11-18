import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './authorization.service';
import { AuthController } from './authorization.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AdministratorsService } from '../administrators/administrators.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminGuard } from './admin.guard';
import { UserGuard } from './user.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [AuthService, UsersService, PrismaService, AdministratorsService, AdminGuard, UserGuard],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
