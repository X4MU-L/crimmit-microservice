import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
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
