import { IsInt, IsNumber, IsNotEmpty, IsString, Min, IsOptional } from 'class-validator';

export class AccountDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  id: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  userId: number;
}

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class TransferAccountDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  accountId: number;

  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;
}
