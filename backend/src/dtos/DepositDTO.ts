export class DepositDto {
  id: number;
  depositNumber: number;
  balance: number;
  currency: string;
  interestPerYear: number;
  accountId: string;
  interval: string
}
