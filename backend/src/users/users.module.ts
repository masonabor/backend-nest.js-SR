import { Module } from '@nestjs/common';
import { UsersAndAdministratorsController } from '../users-and-administrators.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AdministratorsService } from '../administrators/administrators.service';
import { AuthService } from '../authorization/authorization.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersAndAdministratorsController],
  providers: [UsersService, PrismaService, AdministratorsService, AuthService, JwtService]
})
export class UsersModule {}
