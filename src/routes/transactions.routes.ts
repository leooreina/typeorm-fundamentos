import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request: Request, response: Response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.getAllTransactions();
  const balance = await transactionsRepository.getBalance(transactions);

  return response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request: Request, response: Response) => {
  const { title, value, type, category } = request.body;

  const categoriesRepository = getCustomRepository(CategoriesRepository);
  const createTransaction = new CreateTransactionService(categoriesRepository);

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const deleteTransaction = new DeleteTransactionService(
    transactionsRepository,
  );

  const transaction = await deleteTransaction.execute(id);

  return response.json(transaction);
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
