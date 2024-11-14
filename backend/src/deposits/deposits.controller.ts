import { Body, Controller, Post } from '@nestjs/common';
import { DepositService } from './deposits.service';

@Controller('deposits')
export class DepositsController {

  constructor(private depositsService: DepositService) {}


}