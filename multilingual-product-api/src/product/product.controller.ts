import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductTranslation } from './entities/product-translation.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createProduct(@Body() translations: ProductTranslation[]) {
    return this.productService.createProduct(translations);
  }

  @Get('search')
  searchProductByName(
    @Query('language') language: string,
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productService.searchProductByName(language, name, page, limit);
  }
}
