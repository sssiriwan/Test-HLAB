import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './entities/product-translation.entity';
import { Repository, ILike } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<Product>;
  let translationRepository: Repository<ProductTranslation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ProductTranslation),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    translationRepository = module.get<Repository<ProductTranslation>>(getRepositoryToken(ProductTranslation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product with translations', async () => {
      const translations: ProductTranslation[] = [
        { id: 1, language: 'en', name: 'Product 1', description: 'Description 1', product: null },
      ];
      const product: Product = { id: 1, translations };
      jest.spyOn(productRepository, 'create').mockReturnValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      const result = await service.createProduct(translations);

      expect(result).toEqual(product);
      expect(productRepository.create).toHaveBeenCalledWith({ translations });
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('searchProductByName', () => {
    it('should return products with translations based on search criteria', async () => {
      const mockProduct: Product = {
        id: 1,
        translations: [
          {
            id: 1,
            language: 'en',
            name: 'Product 1',
            description: 'Description 1',
            product: null,
          },
        ],
      };

      const mockTranslation: ProductTranslation = {
        id: 1,
        language: 'en',
        name: 'Product 1',
        description: 'Description 1',
        product: mockProduct,
      };

      jest.spyOn(translationRepository, 'findAndCount').mockResolvedValue([[mockTranslation], 1]);

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);

      const result = await service.searchProductByName('en', 'Product', 1, 10);

      expect(result).toEqual({
        products: [
          {
            productId: mockProduct.id,
            translations: mockProduct.translations,
          },
        ],
        total: 1,
      });


      expect(translationRepository.findAndCount).toHaveBeenCalledWith({
        where: { language: 'en', name: ILike('%Product%') },
        skip: 0,
        take: 10,
        relations: ['product'],
      });

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['translations'],
      });
    });
  });
});
