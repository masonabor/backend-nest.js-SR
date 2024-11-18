import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Headers,
  UnauthorizedException,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from '@prisma/client';
import { AuthService } from '../authorization/authorization.service';
import { CreateAccountDto, TransferAccountDto } from '../dtos/account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(
    private accountsService: AccountsService,
    private authService: AuthService,
  ) {}

  @Post('createAccount')
  async createAccount(
    @Body() data: CreateAccountDto,
    @Headers('Authorization') authorization: string,
  ): Promise<Account> {
    const user = await this.authService.decodeHeader(authorization);

    if (user.banned) {
      throw new UnauthorizedException('You are banned');
    }
    return await this.accountsService.createAccount(data, user);
  }

  @Delete('deleteAccount/:id')
  async deleteAccount(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ): Promise<void> {
    const user = await this.authService.decodeHeader(authorization);
    const accountId = parseInt(id, 10);

    if (isNaN(accountId)) {
      throw new BadRequestException('Account ID must be a number');
    }

    await this.accountsService.deleteAccount(accountId, user);
  }

  @Post('deposit/:id')
  async deposit(
    @Param('id') id: string,
    @Body() data: TransferAccountDto,
    @Headers('Authorization') authorization: string,
  ): Promise<Account> {
    const user = await this.authService.decodeHeader(authorization);
    const accountId = parseInt(id, 10);

    if (user.banned) {
      throw new UnauthorizedException('You are banned');
    }

    return await this.accountsService.deposit(accountId, user, data.amount);
  }

  @Put('withdraw')
  async withdraw(
    @Body() data: TransferAccountDto,
    @Headers('Authorization') authorization: string,
  ): Promise<void> {
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
