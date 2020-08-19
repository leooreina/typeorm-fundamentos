// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Category {
  id: any;
  title: string;
}

interface Request {
  title: string;
  value: number;
  type: 'outcome' | 'income';
  category: Category;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;
  private categoriesRepository: CategoriesRepository;

  constructor(
    transactionsRepository: TransactionsRepository,
    categoriesRepository: CategoriesRepository,
  ) {
    this.transactionsRepository = transactionsRepository;
    this.categoriesRepository = categoriesRepository;
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryFound = await this.categoriesRepository.findByTitle(title);

    if (categoryFound) {
      category.id = categoryFound.id;
    } else {
      const categoryCreated = this.categoriesRepository.create({
        title: category.title,
      });
      category.id = categoryCreated.id;
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    return await this.transactionsRepository.save(transaction);
  }
}

export default CreateTransactionService;
