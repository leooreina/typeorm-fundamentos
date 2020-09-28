import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'outcome' | 'income';
  category: string;
}

class CreateTransactionService {
  public categoriesRepository: CategoriesRepository;
  public transactionsRepository: TransactionsRepository;

  constructor(
    public _categoriesRepository: CategoriesRepository,
    public _transactionsRepository: TransactionsRepository,
  ) {
    this.categoriesRepository = _categoriesRepository;
    this.transactionsRepository = _transactionsRepository;
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const balance = await this.transactionsRepository.getBalance(type, value);

    if (balance.total < 0) {
      throw new AppError('Outcome is above income total.');
    }

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

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    return await this.transactionsRepository.save(transaction);
  }
}

export default CreateTransactionService;
