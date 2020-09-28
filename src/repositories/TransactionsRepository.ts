import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(
    type?: 'outcome' | 'income',
    value?: number,
  ): Promise<Balance> {
    const transactions = await this.getAllTransactions();

    if (!transactions || transactions.length === 0) {
      if (type === 'income') {
        return {
          income: value ? value : 0,
          outcome: 0,
          total: value ? value - 0 : 0,
        };
      }
      if (type === 'outcome') {
        return {
          income: 0,
          outcome: value ? value : 0,
          total: value ? 0 - value : 0,
        };
      }
    }

    const sumBalance = (typeBalance: string) =>
      transactions
        .filter(transaction => transaction.type === typeBalance)
        .reduce(
          (acumulator, currentTransaction: Transaction) =>
            acumulator + currentTransaction.value,
          0,
        );

    const income =
      type && value && type === 'income'
        ? sumBalance('income') + value
        : sumBalance('income');
    const outcome =
      type && value && type === 'outcome'
        ? sumBalance('outcome') + value
        : sumBalance('outcome');
    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    return await this.find();
  }
}

export default TransactionsRepository;
