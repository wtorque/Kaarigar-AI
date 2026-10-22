import { categoryRepository, CategoryRepository } from './category.repository.js';
import { CreateCategoryInput, UpdateCategoryInput } from './category.schema.js';

export class CategoryService {
  constructor(private catRepo: CategoryRepository = categoryRepository) {}

  async listCategories() {
    return this.catRepo.listAll();
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.catRepo.findBySlug(slug);
    if (!category) {
      throw new Error('NOT_FOUND: Category not found');
    }
    return category;
  }

  async createCategory(data: CreateCategoryInput) {
    const existing = await this.catRepo.findBySlug(data.slug);
    if (existing) {
      throw new Error('CONFLICT: Category slug already exists');
    }
    return this.catRepo.create(data);
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    return this.catRepo.update(id, data);
  }
}

export const categoryService = new CategoryService();
