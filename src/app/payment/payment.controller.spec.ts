import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentCreateDto } from './dto/payment-create.dto';
import * as request from 'supertest';
import { INestApplication, NotFoundException } from '@nestjs/common';

describe('PaymentController (e2e)', () => {
  let app: INestApplication;

  const API_KEY = '87e9646a-b513-465d-b58d-6df44b9e4925';

  const mockPaymentService = {
    initiatePayment: jest.fn().mockImplementation((dto: PaymentCreateDto) => ({
      paymentId: '12345',
      status: 'pending',
      ...dto,
    })),
    ListAll: jest.fn().mockResolvedValue([
      { paymentId: '12345', status: 'pending' },
      { paymentId: '67890', status: 'processed' },
    ]),
    ListByPaymentId: jest.fn().mockImplementation((paymentId: string) => {
      if (paymentId === 'not-found') {
        throw new NotFoundException('Payment not found');
      }
      return { paymentId, status: 'processed' };
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [{ provide: PaymentService, useValue: mockPaymentService }],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Middleware para validar API Key nos testes
    app.use((req, res, next) => {
      if (req.headers['x-api-key'] !== API_KEY) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a payment (POST /payments)', async () => {
    const createPaymentDto = {
      amount: 3452,
      currency: 'BRL',
      method: 'PAYPAL',
      productId: '87e9646a-b513-465d-b58d-6df44b9e4925',
    };

    const response = await request(app.getHttpServer())
      .post('/payments')
      .set('x-api-key', API_KEY)
      .send(createPaymentDto)
      .expect(201);

    expect(response.body).toMatchObject({
      paymentId: expect.any(String),
      status: 'pending',
    });
  });

  it('should return 401 when API Key is missing (POST /payments)', async () => {
    await request(app.getHttpServer())
      .post('/payments')
      .send({
        amount: 3452,
        currency: 'BRL',
        method: 'PAYPAL',
        productId: '87e9646a-b513-465d-b58d-6df44b9e4925',
      })
      .expect(401);
  });

  it('should list all payments (GET /payments)', async () => {
    const response = await request(app.getHttpServer()).get('/payments').set('x-api-key', API_KEY).expect(200);

    expect(response.body).toEqual([
      { paymentId: '12345', status: 'pending' },
      { paymentId: '67890', status: 'processed' },
    ]);
  });

  it('should get a payment by ID (GET /payments/:paymentId)', async () => {
    const paymentId = '12345';
    const response = await request(app.getHttpServer())
      .get(`/payments/${paymentId}`)
      .set('x-api-key', API_KEY)
      .expect(200);

    expect(response.body).toEqual({ paymentId, status: 'processed' });
  });

  it('should return 401 when API Key is missing (GET /payments/:paymentId)', async () => {
    await request(app.getHttpServer()).get('/payments/50c1f1d7-e890-4784-8154-b5f72bd8b9ba').expect(401);
  });

  it('should return 404 if payment ID does not exist (GET /payments/:paymentId)', async () => {
    await request(app.getHttpServer()).get('/payments/not-found').set('x-api-key', API_KEY).expect(404);
  });
});
