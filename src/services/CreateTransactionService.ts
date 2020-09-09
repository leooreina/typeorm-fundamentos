// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'outcome' | 'income';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title: title_transaction,
    value,
    type,
    category: category_title,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getRepository(Transaction);
    let categoryToSave: Category;

    const categoryExists:
      | Category
      | undefined = await categoriesRepository.findOne({
      where: { title: category_title },
    });

    if (!categoryExists) {
      categoryToSave = categoriesRepository.create({ title: category_title });
    } else {
      categoryToSave = categoryExists;
    }

    const transaction = transactionsRepository.create({
      title: title_transaction,
      value,
      type,
      category_id: categoryToSave.id,
    });

    return await transactionsRepository.save(transaction);
  }
}

export default CreateTransactionService;
