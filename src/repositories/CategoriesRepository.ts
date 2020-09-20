import Category from '../models/Category';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findByTitle(title: string): Promise<Category | undefined> {
    return (
      (await this.findOne({
        title,
      })) || undefined
    );
  }
}

export default CategoriesRepository;
