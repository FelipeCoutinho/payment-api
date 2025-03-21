import { Column, Entity } from 'typeorm';
import { Status } from '../enum/payment-enum';
import { AbstractEntity } from '../../database/orm/abstract-entity';
import { Expose } from 'class-transformer';

@Entity('payments')
export class Payment extends AbstractEntity {
  @Expose()
  @Column({ name: 'id', nullable: false })
  id: string;

  @Expose()
  @Column({ name: 'amount', nullable: false })
  amount: number;

  @Expose()
  @Column({ name: 'currency', nullable: false, length: 10, unique: false })
  currency: string;

  @Expose()
  @Column({ name: 'method', length: 20 })
  method: string;

  @Expose()
  @Column({ name: 'status', nullable: false, default: Status.PENDING, length: 20 })
  status: Status;
  @Expose()
  @Column({ name: 'product_id', nullable: false, default: Status.PENDING })
  productId: string;
}
