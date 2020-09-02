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
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getRepository(Transaction);
    let categoryToSave: Category;

    const categoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      categoryToSave = categoriesRepository.create({ title: category });
    } else {
      categoryToSave = categoryExists;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryToSave.id,
    });

    return await transactionsRepository.save(transaction);
  }
}

export default CreateTransactionService;
