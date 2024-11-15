import { Body, Controller, Headers, Post, Req, UnauthorizedException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Prisma, Transaction } from '@prisma/client';
import { AuthService } from '../authorization/authorization.service';
import { UsersService } from '../users/users.service';

@Controller('transactions')
export class TransactionsController {

  constructor(private transactionsService: TransactionsService,
              private authService: AuthService,
              private usersService: UsersService,) {}

  @Post('transaction')
  async transaction(@Body() data: Prisma.TransactionCreateInput,
                     @Body('fromAccountNumber') fromAccountNUmber: number,
                     @Body('toAccountNumber') toAccountNumber: number,
                     @Headers('Authorization') authorization: string): Promise<Transaction> {

    const decodedToken = await this.authService.decodeHeader(authorization);
    const user = await this.usersService.getUserByEmail(decodedToken.email);

    if (user.banned) {
      throw new UnauthorizedException('You are banned');
    }

    const transaction = await this.transactionsService.createTransaction(data, fromAccountNUmber, toAccountNumber, user);

    if (!transaction) {
      throw new Error("Транзакція не проведене");
    }
    return transaction;
  }
}