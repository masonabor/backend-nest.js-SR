import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDto } from '../dtos/DepositDTO';

@Injectable()
export class DepositService {

  constructor(private prisma: PrismaService) {}

  async createDeposit(userId: number, accountId: number, createDepositDto: DepositDto) {

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { user: true },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('You do not have access to this account');
    }

    return this.prisma.deposit.create({
      data: {
        depositNumber: createDepositDto.depositNumber,
        balance: createDepositDto.balance,
        currency: createDepositDto.currency,
        interestPerYear: createDepositDto.interestPerYear,
        accountId: account.id,
      },
    });
  }
}
