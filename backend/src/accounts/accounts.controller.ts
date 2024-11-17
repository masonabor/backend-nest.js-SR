import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Headers,
  UnauthorizedException, BadRequestException, Put,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account, Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { AuthService } from '../authorization/authorization.service';

@Controller('accounts')
export class AccountsController {

  constructor(private accountsService: AccountsService, private usersService: UsersService, private authService: AuthService) {}

  @Post('createAccount')
  async createAccount(@Body() data: Prisma.AccountCreateInput, @Headers('Authorization') authorization: string): Promise<Account> {

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header must be provided in the format: Bearer <token>');
    }
    console.log(authorization)
    const token = authorization.replace('Bearer ', '');
    let user = null;

    try {
      const decodedToken = await this.authService.verifyToken(token);
      user = await this.usersService.getUserByEmail(decodedToken.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (user.banned) {
      throw new UnauthorizedException('You are banned');
    }
    return await this.accountsService.createAccount(data, user);
  }

  @Delete('deleteAccount/:id')
  async deleteAccount(@Param('id') id: string, @Headers('Authorization') authorization: string  ): Promise<void> {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header must be provided in the format: Bearer <token>');
    }

    let user = null;
    const token = authorization.replace('Bearer ', '');
    try {
      const decodedToken = this.authService.verifyToken(token);
      user = await this.usersService.getUserByEmail(decodedToken.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const accountId = parseInt(id, 10);
    if (isNaN(accountId)) {
      throw new BadRequestException('Account ID must be a number');
    }
    await this.accountsService.deleteAccount(accountId, user);
  }

  @Post('deposit/:id')
  async deposit(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Headers('Authorization') authorization: string
  ): Promise<Account> {

    const accountId = parseInt(id, 10);
    let user = null;

    try {
      const decodedToken = await this.authService.decodeHeader(authorization);
      user = await this.usersService.getUserByEmail(decodedToken.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (user.banned) {
      throw new UnauthorizedException('You are banned');
    }

    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero');
    }

    return await this.accountsService.deposit(accountId, user, amount);
  }

  @Put('withdraw')
  async withdraw(@Body() data: { accountId: number, amount: number }, @Headers('Authorization') authorization: string): Promise<void> {
    const user = await this.authService.decodeHeader(authorization);

     if (user.banned) {
       throw new UnauthorizedException('You are banned');
     }

     const account = await this.accountsService.getAccountById(data.accountId);

     if (account.userId !== user.userId) {
       throw new UnauthorizedException('It is not your account');
     }

     if (account.balance < data.amount) {
       throw new BadRequestException('You have not enough balance');
     }

     await this.accountsService.updateBalance(account.id, account.balance - data.amount);
  }

}