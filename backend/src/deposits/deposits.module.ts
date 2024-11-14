import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositService } from './deposits.service';
import { DepositsController } from './deposits.controller';

@Module({
  controllers: [DepositsController],
  providers: [PrismaService, DepositService]
})
export class DepositsModule {}