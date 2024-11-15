import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {

    if (await this.getUserByEmail(data.email)) {
      throw new NotFoundException('Email already exists');
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
        banned: data.banned,
        banReason: data.banReason,
      }
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {email}
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {id}
    });

    return user ? user : null;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    return user ? user : null;
  }

  async getAllUsers(): Promise<User[] | null> {
    return this.prisma.user.findMany();
  }

  async getUserWithAccountsAndDeposits(email: string): Promise<User> {
    const userWithAccountsAndDeposits = await this.prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          include: {
            deposits: true
          }
        }
      }
    });

    if (!userWithAccountsAndDeposits) {
      throw new Error(`User with email ${email} not found`);
    }
    return userWithAccountsAndDeposits;
  }

  async getUserWithAccounts(email: string): Promise<Account[]> {
    const userWithAccounts = await this.prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true
        }
      });

    if (!userWithAccounts) {
      throw new Error(`User with email ${email} not found`);
    }
    return userWithAccounts.accounts;
  }

  async banUser(email: string, banReason: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: {
        banned: true,
        banReason,
      },
    });
  }

}
