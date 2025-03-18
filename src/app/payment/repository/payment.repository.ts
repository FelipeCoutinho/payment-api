import { Injectable } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { DynamicSort } from '../../orm/sort/dynamic-sort';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '../../orm/abstract.repository';

@Injectable()
export class PaymentRepository extends AbstractRepository<Payment> {
  constructor(
    @InjectRepository(Payment)
    repository: Repository<Payment>,
  ) {
    super(repository);
  }

  async findAllFiltered(params?: any, sort?: DynamicSort, pagination?: IPaginationOptions) {
    const queryBuilder = this.createQueryBuilder('m').innerJoinAndSelect('m.organization', 'o');

    return await super.findAllWithQueryBuilder(queryBuilder, pagination);
  }

  async existsByEmail(id: string) {
    return await this.exists({
      where: {
        id,
      },
    });
  }

  async existsPayment(id: string) {
    return await this.exists({
      where: {
        id,
      },
    });
  }
}
