import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_translations')
export class ProductTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  language: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Product, (product) => product.translations)
  product: Product;
}
