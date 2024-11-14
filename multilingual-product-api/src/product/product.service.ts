import { Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './entities/product-translation.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(ProductTranslation)
    private translationRepository: Repository<ProductTranslation>,
  ) {}

  async createProduct(translations: ProductTranslation[]): Promise<Product> {
    const product = this.productRepository.create({ translations });
    return this.productRepository.save(product);
  }

  async searchProductByName(language: string, name: string, page: number, limit: number) {
    const [products, total] = await this.translationRepository.findAndCount({
      where: { language, name: ILike(`%${name}%`) },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { products, total };
  }
}
