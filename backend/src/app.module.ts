import {  Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { AdministratorsModule } from './administrators/administrators.module';
import { TransactionsModule } from './transactions/transactions.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './authorization/authorization.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
      ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`,
        isGlobal: true
      }),
      PrismaModule, UsersModule, AccountsModule, AdministratorsModule, HttpModule, TransactionsModule, AuthModule, CurrencyModule],
})
export class AppModule {}