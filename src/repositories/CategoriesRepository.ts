import Category from '../models/Category';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {}

export default CategoriesRepository;
