import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom} from 'rxjs';

@Injectable()
export class CurrencyService {
  private readonly API_URL = 'https://api.exchangerate-api.com/v4/latest';
  private readonly allowedCurrencies = ['UAH', 'EUR', 'USD'];

  constructor(private readonly httpService: HttpService) {}

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (!this.allowedCurrencies.includes(fromCurrency) || !this.allowedCurrencies.includes(toCurrency)) {
      throw Error(`Конвертація валют ${fromCurrency}/${toCurrency} не підтримується`)
    }

    try {
      const response = await lastValueFrom(this.httpService.get(`${this.API_URL}/${fromCurrency}`));
      const rates = response.data.rates;

      const rate = rates[toCurrency];
      // if (!rate) {
      //   throw new Error(`Не вдалося знайти курс валюти ${toCurrency}`);
      // }
      return amount * rate;

    } catch (error) {
      throw new Error(`Помилка при конвертації: ${error.message}`)
    }
  }

}