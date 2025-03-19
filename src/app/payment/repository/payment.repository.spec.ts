import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRepository } from './payment.repository';
import { TestDatabase } from '../../../app/database/test-database';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Status } from '../enum/payment-enum';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

describe('PaymentRepository (Integration)', () => {
  let testDatabase: TestDatabase;
  let repository: PaymentRepository;

  beforeAll(async () => {
    testDatabase = await TestDatabase.getInstance();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentRepository,
        {
          provide: getRepositoryToken(Payment),
          useValue: testDatabase.dataSource.getRepository(Payment),
        },
      ],
    }).compile();
    repository = module.get<PaymentRepository>(PaymentRepository);
  });

  it('should insert and retrieve a payment', async () => {
    const payment: Payment = {
      id: '50c1f1d7-e890-4784-8154-b5f72bd8b9ba',
      amount: 3452,
      currency: 'BRL',
      method: 'PAYPAL',
      status: Status.PENDING,
      productId: '87e9646a-b513-465d-b58d-6df44b9e4925',
      createdAt: new Date(),
      updateAt: new Date(),
    };

    await repository.save(payment);

    const found = await repository.findById('50c1f1d7-e890-4784-8154-b5f72bd8b9ba');
    expect(found).toBeDefined();
    expect(found?.status).toBe(Status.PENDING);
  });

  it('should throw NotFoundException if payment not found', async () => {
    await expect(repository.findById(randomUUID())).rejects.toThrow(NotFoundException);
  });
});
