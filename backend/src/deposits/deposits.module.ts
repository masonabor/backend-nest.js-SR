import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { AuthService } from '../authorization/authorization.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AdministratorsService } from '../administrators/administrators.service';
import { AccountsService } from '../accounts/accounts.service';

@Module({
  controllers: [DepositsController],
  providers: [PrismaService, DepositService, AuthService, UsersService, JwtService, AdministratorsService, AccountsService],
})
export class DepositsModule {}