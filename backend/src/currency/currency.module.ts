import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CurrencyController } from './currency.controller';

@Module({
  imports: [HttpModule],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {

}