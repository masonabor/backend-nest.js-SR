import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Headers,
  UnauthorizedException, BadRequestException,
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

    try {
      const decodedToken = await this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(decodedToken.email);
      console.log(user);
      console.log(decodedToken);
      return await this.accountsService.createAccount(data, user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
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

    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero');
    }

    return await this.accountsService.deposit(accountId, user, amount);
  }


  // @Get('userAccounts/:id')
  // async getUserAccounts(@Param()): Promise<Account[]> {
  //   return await this.userService.getUserWithAccounts(Number(id));
  // }

}