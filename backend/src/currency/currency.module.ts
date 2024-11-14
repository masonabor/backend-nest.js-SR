import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [CurrencyService, HttpService],
})
export class CurrencyModule {

}