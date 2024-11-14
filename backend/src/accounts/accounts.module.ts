import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../authorization/authorization.service';
import { JwtService } from '@nestjs/jwt';
import { AdministratorsService } from '../administrators/administrators.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService, UsersService, AuthService, JwtService, AdministratorsService],
})
export class AccountsModule {}