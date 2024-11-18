import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account } from '@prisma/client';
import { currencies } from '../shared/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../dtos/user.dto';
import { AccountDto, CreateAccountDto } from '../dtos/account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService, private usersService: UsersService) {}

  async createAccount(data: CreateAccountDto, user: CreateUserDto): Promise<Account> {
    if (!Object.values(currencies).includes(data.currency)) {
      throw new NotFoundException('Currency not found');
    }

    return this.prisma.account.create({
      data: {
        accountNumber: Math.floor(10000000 + Math.random() * 90000000),
        currency: data.currency,
        user: {
          connect: { id: user.userId },
        },
      },
    });
  }

  async getAccountById(id: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return account;
  }

  async getAccountByAccountNumber(accountNumber: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { accountNumber },
    });

    if (!account) {
      throw new NotFoundException(`Account with account number ${accountNumber} not found`);
    }
    return account;
  }

  async deleteAccount(id: number, user: CreateUserDto): Promise<void> {
    const account = await this.getAccountById(id);
    const userAccounts = await this.usersService.getUserWithAccounts(user.email);

    if (!userAccounts.some(userAccount => userAccount.id === account.id)) {
      throw new UnauthorizedException(`Account with id ${id} does not belong to the user`);
    }

    await this.prisma.account.delete({ where: { id } });
  }

  async deposit(accountId: number, user: CreateUserDto, amount: number): Promise<Account> {
    const account = await this.getAccountById(accountId);

    if (account.userId !== user.userId) {
      throw new UnauthorizedException('You do not have permission to access this account');
    }

    return this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });
  }

  async updateBalance(id: number, balance: number): Promise<Account> {
    return this.prisma.account.update({
      where: { id },
      data: { balance },
    });
  }
}
