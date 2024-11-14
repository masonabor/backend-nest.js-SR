export class DepositDto {
  id: number;
  depositNumber: number;
  balance: number;
  currency: string;
  interestPerYear: number;
  accountId: number; // Foreign key for Account relation
}
