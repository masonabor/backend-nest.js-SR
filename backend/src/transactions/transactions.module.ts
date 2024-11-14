import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CurrencyService } from '../currency/currency.service';
import { HttpModule } from '@nestjs/axios';
import { AccountsService } from '../accounts/accounts.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../authorization/authorization.service';
import { JwtService } from '@nestjs/jwt';
import { AdministratorsService } from '../administrators/administrators.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService, CurrencyService, AccountsService, UsersService, AuthService, JwtService, AdministratorsService],
  imports: [HttpModule]
})
export class TransactionsModule {}