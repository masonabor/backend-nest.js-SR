import {
  Body,
  Controller,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from '@prisma/client';
import { AuthService } from '../authorization/authorization.service';
import { UsersService } from '../users/users.service';
import { TransactionDto } from '../dtos/transaction.dto';


@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionsService: TransactionsService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('transaction')
  async transaction(
    @Body() data: TransactionDto,
    @Headers('Authorization') authorization: string,
  ): Promise<Transaction> {
    const decodedToken = await this.authService.decodeHeader(authorization);
    const user = await this.usersService.getUserByEmail(decodedToken.email);

    if (user.banned) {
      throw new UnauthorizedException('You are banned');
    }

    const transaction = await this.transactionsService.createTransaction(data, user);

    if (!transaction) {
      throw new Error('Transaction failed');
    }

    return transaction;
  }
}
