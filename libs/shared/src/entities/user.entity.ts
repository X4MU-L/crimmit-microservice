import { Column, Entity, ObjectId, ObjectIdColumn, OneToMany } from 'typeorm';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';

@Entity()
export class UserEntity {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  @OneToMany(() => ProductEntity, (product) => product.user)
  products: ProductEntity[];
}
