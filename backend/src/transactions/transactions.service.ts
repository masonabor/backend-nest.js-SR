import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction, User } from '@prisma/client';
import { CurrencyService } from '../currency/currency.service';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionDto } from '../dtos/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private currencyService: CurrencyService,
    private accountsService: AccountsService,
  ) {}

  async createTransaction(data: TransactionDto, user: User): Promise<Transaction> {
    const { fromAccountNumber, toAccountNumber, amountFromCurrency } = data;

    const fromAccount = await this.accountsService.getAccountByAccountNumber(fromAccountNumber);
    const toAccount = await this.accountsService.getAccountByAccountNumber(toAccountNumber);

    if (!fromAccount || !toAccount) {
      throw new HttpException('Invalid account(s)', HttpStatus.BAD_REQUEST);
    }
    if (fromAccount.userId !== user.id) {
      throw new HttpException('You are not the owner', HttpStatus.BAD_REQUEST);
    }
    if (fromAccount.balance < amountFromCurrency) {
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }

    const amountToCurrency = await this.currencyService.convertCurrency(
      amountFromCurrency,
      fromAccount.currency,
      toAccount.currency,
    );

    return this.prisma.$transaction(async (prisma) => {
      await prisma.account.update({
        where: { accountNumber: fromAccountNumber },
        data: {
          balance: {
            decrement: amountFromCurrency,
          },
        },
      });

      await prisma.account.update({
        where: { accountNumber: toAccountNumber },
        data: {
          balance: {
            increment: amountToCurrency,
          },
        },
      });

      return prisma.transaction.create({
        data: {
          fromAccountNumber,
          toAccountNumber,
          amountFromCurrency,
          amountToCurrency,
        },
      });
    });
  }
}
