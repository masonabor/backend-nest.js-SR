import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account, Prisma, User } from '@prisma/client';
import { currencies} from '../shared/config';
import { UsersService } from '../users/users.service';


@Injectable()
export class AccountsService {

  constructor(private prisma: PrismaService, private usersService: UsersService) {}

  async createAccount(data: Prisma.AccountCreateInput, user: User): Promise<Account> {
    if (!Object.values(currencies).includes(data.currency)) {
      throw new NotFoundException('Currency not found');
    }

    return this.prisma.account.create({
      data: {
        accountNumber: Math.floor(10000000 + Math.random() * 90000000),
        currency: data.currency,
        user: {
          connect: { id: user.id }
        }
      }
    });
  }

  async getAccountById(id: number): Promise<Account> {
    const account = this.prisma.account.findUnique({
      where: {
        id: id
      }
    });

    return account ? account : null;
  }

  async getAccountByAccountNumber(accountNumber: number): Promise<Account> {
    const account = this.prisma.account.findUnique({
      where: { accountNumber: accountNumber }
    });

    return account ? account : null;
  }

  async deleteAccount(id: number, user: User): Promise<void> {
    const account = await this.getAccountById(id);
    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }

    const usersAccounts = await this.usersService.getUserWithAccounts(user.email);
    const resolvedAccounts = await Promise.all(usersAccounts);

    const isUserAccount = resolvedAccounts.some(userAccount => userAccount.id === account.id);
    if (!isUserAccount) {
      throw new UnauthorizedException(`Account with id ${id} does not belong to the user`);
    }

    await this.prisma.account.delete({
      where: {
        id: id,
      },
    });
  }

  async deposit(accountId: number, user: User, amount: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }

    if (account.userId !== user.id) {
      throw new UnauthorizedException('You do not have permission to access this account');
    }

    return this.prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }
}