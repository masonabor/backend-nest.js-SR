import { Body, Controller, Post, Headers, Delete, Param, UnauthorizedException, Put, Get } from '@nestjs/common';
import { DepositService } from './deposits.service';
import { DepositDto } from '../dtos/DepositDTO';
import { Deposit, DepositHistory } from '@prisma/client';
import { AuthService } from '../authorization/authorization.service';

@Controller('deposits')
export class DepositsController {

  constructor(private depositsService: DepositService,
              private authService: AuthService) {}

  @Post('createDeposit')
  async createDeposit(@Body() data: DepositDto, @Headers('Authorization') authorization: string): Promise<Deposit> {
    const decodedToken = await this.authService.decodeHeader(authorization);

    return await this.depositsService.createDeposit(decodedToken.userId, data.accountId, data);
  }

  @Delete('deleteDeposit/:depositId/:accountId')
  async deleteDeposit(@Headers('Authorization') authorization: string, @Param('depositId') depositId: string, @Param('accountId') accountId: string): Promise<void> {
    const decodedToken = await this.authService.decodeHeader(authorization);
    await this.depositsService.deleteDeposit(depositId, accountId, decodedToken.userId)
  }

  @Put('updateInterestRate')
  async updateInterestRate(@Body() data: { id: number, interestPerYear: number}, @Headers('Authorization') authorization: string): Promise<void> {
    const decodedToken = await this.authService.decodeHeader(authorization);

    if (!decodedToken.isAdmin) {
      throw new UnauthorizedException('You are not an admin');
    }
    await this.depositsService.updateInterest(data.id, data.interestPerYear);
  }

  @Get('checkProfit/:id')
  async checkProfit(@Param('id') id: string): Promise<number> {
    return await this.depositsService.checkDeposit(id);
  }

  @Get('checkDepositHistory/:userId')
  async checkDepositHistory(@Param('userId') userId: string): Promise<DepositHistory[]> {
    return await this.depositsService.getDepositHistory(userId);
  }
}