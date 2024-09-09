import { Column, Entity, ManyToMany, ObjectId, ObjectIdColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity()
export class OrderEntity {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column()
  quantity: number;
  @Column()
  totalPrice: number;
  @Column()
  description: string;
  @Column()
  userId: string;
  @Column()
  productIds: ObjectId[];
  @ManyToMany(() => ProductEntity, (product) => product.orders)
  products: ProductEntity[];
}
