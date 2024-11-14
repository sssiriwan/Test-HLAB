import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres', 
      password: '123456', 
      database: 'multilingual_products',
      autoLoadEntities: true, 
      synchronize: true, 
    }),
    ProductModule,
  ],
})
export class AppModule {}
