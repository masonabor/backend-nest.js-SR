import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersAndAdministratorsController } from '../users-and-administrators.controller';
import { AdministratorsService } from './administrators.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../authorization/authorization.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersAndAdministratorsController],
  providers: [PrismaService, AdministratorsService, UsersService, AuthService, JwtService],
})
export class AdministratorsModule {

}