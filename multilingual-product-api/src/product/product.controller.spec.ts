import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductTranslation } from './entities/product-translation.entity';
import { Product } from './entities/product.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: ProductService,
          useValue: {
            createProduct: jest.fn(),
            searchProductByName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product and return it', async () => {
      const translations: ProductTranslation[] = [
        {
          id: 1, 
          language: 'en',
          name: 'Product 1',
          description: 'Description 1',
          product: { id: 1, translations: [] } as Product, 
        },
      ];
      const result = { id: 1, translations };

      
      jest.spyOn(service, 'createProduct').mockResolvedValue(result);

      const response = await controller.createProduct(translations);
      expect(response).toEqual(result);
    });
  });

  describe('searchProductByName', () => {
    it('should return products matching the search criteria', async () => {
      const mockProducts = {
        products: [
          { 
            productId: 1, 
            translations: [
              {
                id: 1,
                language: 'en',
                name: 'Product 1',
                description: 'Description 1',
                product: { id: 1, translations: [] } as Product 
              },
            ] 
          },
        ],
        total: 1,
      };

      jest.spyOn(service, 'searchProductByName').mockResolvedValue(mockProducts);

      const query = { language: 'en', name: 'Product', page: 1, limit: 10 };
      const response = await controller.searchProductByName(query.language, query.name, query.page, query.limit);

      expect(response).toEqual(mockProducts);
    });
  });
});
