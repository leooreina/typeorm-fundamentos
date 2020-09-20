import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    const sumBalance = (typeBalance: string) =>
      transactions
        .filter(transaction => transaction.type === typeBalance)
        .reduce(
          (acumulator, currentTransaction: Transaction) =>
            acumulator + currentTransaction.value,
          0,
        );

    return {
      income: sumBalance('income'),
      outcome: sumBalance('outcome'),
      total: sumBalance('income') - sumBalance('outcome'),
    };
  }
}

export default TransactionsRepository;
