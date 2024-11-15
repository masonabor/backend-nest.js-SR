import { Controller, Get, Param } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('exchange')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('convert/:fromCurrency/:toCurrency/:amount')
  async convertBalance(@Param('fromCurrency') fromCurrency: string,
                       @Param('toCurrency') toCurrency: string,
                       @Param('amount') amount: string): Promise<{amount: string}> {
    const amountToNumber = parseFloat(amount);
    const convertedAmount = await this.currencyService.convertCurrency(amountToNumber, fromCurrency, toCurrency);
    return { amount: convertedAmount.toString() };
  }

}