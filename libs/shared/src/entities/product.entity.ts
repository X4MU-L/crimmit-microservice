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
import { OrderEntity } from './order.entity';

@Entity()
export class ProductEntity {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column({ unique: true })
  name: string;
  @Column()
  price: number;
  @Column()
  description: string;
  @Column()
  userId: string;
  @ManyToOne(() => UserEntity, (user) => user.products)
  @JoinColumn({ name: 'userId' }) // Specify join column if needed
  user: UserEntity;
  @ManyToMany(() => OrderEntity, (order) => order.products)
  orders: OrderEntity[];
}
