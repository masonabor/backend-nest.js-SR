import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';

export class DepositDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  balance: number;

  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  interval: string;
}
