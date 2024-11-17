import { Injectable, ForbiddenException, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDto } from '../dtos/DepositDTO';
import { Deposit, DepositHistory } from '@prisma/client';
import { AccountsService } from '../accounts/accounts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DepositService {

  constructor(private prisma: PrismaService,
              private accountsService: AccountsService,
              private usersService: UsersService,) {}

  async createDeposit(userId: string, accountId: string, createDepositDto: DepositDto) {

    const interestPerYear = 20;
    const accountIdToNumber = parseInt(accountId, 10);
    const userIdToNumber = parseInt(userId, 10);

    let account = await this.accountsService.getAccountById(accountIdToNumber)
    const user = await this.usersService.getUserById(userId);

    if (user.banned) {
      throw new HttpException('You are banned', HttpStatus.BAD_REQUEST);
    }

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }

    if (account.userId !== userIdToNumber) {
      throw new ForbiddenException('You do not have access to this account');
    }

    if (account.balance >= createDepositDto.balance) {
      const newBalance = account.balance - createDepositDto.balance;
      account = await this.accountsService.updateBalance(account.id, newBalance);

      const interval = parseInt(createDepositDto.interval, 10);
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + interval);
      const depositNumber = Math.floor(10000000 + Math.random() * 90000000)

      await this.prisma.depositHistory.create({
        data: {
          depositNumber,
          balance: createDepositDto.balance,
          currency: account.currency,
          interestPerYear: interestPerYear,
          userId: userIdToNumber,
          expiryDate: expiryDate.toISOString(),
          interval
        },
      })

      return this.prisma.deposit.create({
        data: {
          depositNumber,
          balance: createDepositDto.balance,
          currency: account.currency,
          interestPerYear: interestPerYear,
          accountId: account.id,
          expiryDate: expiryDate.toISOString(),
          interval
        }
      });
    } else {
      throw new HttpException('Not enough balance to create deposit', HttpStatus.BAD_REQUEST);
    }
  }

  async getDepositByAccountNumber(depositNumber: number): Promise<Deposit> {
    const deposit = this.prisma.deposit.findUnique({
      where: { depositNumber }
    });

    return deposit ? deposit : null;
  }

  async getDepositById(id: number): Promise<Deposit> {
    return this.prisma.deposit.findUnique({
      where: { id }
    });
  }

  async deleteDeposit(depositId: string, accountId: string, userId: string): Promise<void> {
    const account = await this.accountsService.getAccountById(parseInt(accountId, 10));
    const deposit = await this.getDepositById(parseInt(depositId, 10));
    const userIdToNumber = parseInt(userId, 10);

    if (!account || account.userId !== userIdToNumber) {
      throw new NotFoundException(`Account with ID ${accountId} not found or you are not an owner`);
    }

    if (!deposit) {
      throw new NotFoundException(`Deposit with ID ${depositId} not found`);
    }


    const newBalance = account.balance + deposit.balance;

    await this.accountsService.updateBalance(parseInt(accountId, 10), newBalance);

    await this.prisma.deposit.delete({
      where: { id: parseInt(depositId, 10) }
    });
  }

  async checkDeposit(id: string): Promise<number> {
    function calculateBalance(interval: number, interestPerYear: number, amount: number): number {
      if (interval === 1) {
        return ((amount / 100) * interestPerYear) + amount;
      }

      return calculateBalance((interval - 1), interestPerYear,  ((amount / 100) * interestPerYear) + amount);
    }
    const idToNumber = parseInt(id, 10)
    const deposit = await this.getDepositById(idToNumber);

    return calculateBalance(deposit.interval, deposit.interestPerYear, deposit.balance);
  }

  async updateInterest(id: number, interestPerYear: number): Promise<void> {
    await this.prisma.deposit.update({
      where: { id },
      data: {
        interestPerYear
      }
    })
  }

  async getDepositHistory(userId: string): Promise<DepositHistory[]> {
    return this.prisma.depositHistory.findMany({
      where: { userId: parseInt(userId, 10) },
      orderBy: {
        dateOfCreation: 'desc'
      }
    })
  }
}
