import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class TransactionDto {
  @IsInt()
  @IsNotEmpty()
  fromAccountNumber: number;

  @IsInt()
  @IsNotEmpty()
  toAccountNumber: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amountFromCurrency: number;
}
