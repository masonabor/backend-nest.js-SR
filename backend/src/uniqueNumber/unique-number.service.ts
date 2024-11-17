// import { Injectable } from '@nestjs/common';
// import { AccountsService } from '../accounts/accounts.service';
// import { DepositService } from '../deposits/deposits.service';
//
// @Injectable()
// export class UniqueNumberService {
//
//   constructor(private readonly accountsService: AccountsService,
//               private readonly depositService: DepositService) {
//   }
//
//   async createUniqueNumber(type: string): Promise<number> {
//     let attempts = 0;
//     const maxAttempts = 15;
//
//     while (attempts < maxAttempts) {
//       const number = Math.floor(10000000 + Math.random() * 90000000);
//
//       if (type === 'account') {
//         const account = await this.accountsService.getAccountByAccountNumber(number);
//         if (!account) {
//           return number;
//         }
//       } else if (type === 'deposit') {
//         const deposit = await this.depositService.getDepositByAccountNumber(number);
//         if (!deposit) {
//           return number;
//         }
//       } else {
//         throw new Error('Invalid type specified');
//       }
//
//       attempts++;
//     }
//
//     throw new Error('Unable to generate a unique number after maximum attempts');
//   }
//
// }