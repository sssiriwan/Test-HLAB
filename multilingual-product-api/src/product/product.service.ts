import { Injectable, BadRequestException, InternalServerErrorException  } from '@nestjs/common';
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
    if (!translations || translations.length === 0) {
      throw new BadRequestException('Translations cannot be empty.');
    }

    const errors: string[] = [];

    translations.forEach((translation, index) => {
      if (!translation.language) {
        errors.push(`Translation ${translation.language}: Language is required.`);
      }

      if (!translation.name) {
        errors.push(`Translation ${translation.language}: Name is required.`);
      }

      if (translation.description && (translation.description.length < 5 || translation.description.length > 255)) {
        errors.push(`Translation ${translation.language}: Description must be between 5 and 255 characters.`);
      }
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const product = this.productRepository.create({ translations });
      return await this.productRepository.save(product);
    } catch (error) {
      if (error.code === '23502') { 
        throw new BadRequestException('One or more required fields are missing.');
      }
      throw new InternalServerErrorException('Failed to create product.');
    }
  }

  async searchProductByName(language: string, name: string, page: number, limit: number) {
    if (!name) {
      throw new BadRequestException('Name is required.');
    }
  
    if (!page || page <= 0) {
      throw new BadRequestException('Page must be a positive number.');
    }
  
    if (!limit || limit <= 0) {
      throw new BadRequestException('Limit must be a positive number.');
    }
  
    const [translations, total] = await this.translationRepository.findAndCount({
      where: { language, name: ILike(`%${name}%`) },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['product'],
    });
  
    const products = await Promise.all(
      translations.map(async (translation) => {
        const product = await this.productRepository.findOne({
          where: { id: translation.product.id },
          relations: ['translations'],
        });
  
        return {
          productId: translation.product.id,
          translations: product.translations,
        };
      }),
    );
  
    return { products, total };
  }
  
  
}
