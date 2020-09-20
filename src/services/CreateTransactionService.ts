// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'outcome' | 'income';
  category: string;
}

class CreateTransactionService {
  public categoriesRepository: CategoriesRepository;

  constructor(public _categoriesRepository: CategoriesRepository) {
    this.categoriesRepository = _categoriesRepository;
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getRepository(Transaction);
    const categoryExists = await this.categoriesRepository.findByTitle(
      category,
    );
    let category_id: string;

    if (categoryExists) {
      category_id = categoryExists.id;
    } else {
      const categoryCreated = await this.categoriesRepository.save({
        title: category,
      });
      category_id = categoryCreated.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    return await transactionsRepository.save(transaction);
  }
}

export default CreateTransactionService;
