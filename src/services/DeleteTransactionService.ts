// import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public transactionsRepository: TransactionsRepository;

  constructor(public _transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = _transactionsRepository;
  }

  public async execute(id: string): Promise<void> {}
}

export default DeleteTransactionService;
