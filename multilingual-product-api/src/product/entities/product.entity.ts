import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductTranslation } from './product-translation.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ProductTranslation, (translation) => translation.product, { cascade: true })
  translations: ProductTranslation[];
}
