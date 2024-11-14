export class TransactionDto {
  id: number;
  fromAccountNumber: number; // Foreign key for Account relation
  toAccountNumber: number;   // Foreign key for Account relation
  amountFromCurrency: number;
  amountToCurrency: number;
  fromCurrency: string;
  toCurrency: string;
}
