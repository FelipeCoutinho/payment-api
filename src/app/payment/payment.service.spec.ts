import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { ExternalPaymentProviderService } from '../../resource/ExternalPaymentProvider/externalPaymentProvider-resource.service';
import { PaymentCreateDto } from './dto/payment-create.dto';
import { Payment } from './entities/payment.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { PaymentMethod, Status } from './enum/payment-enum';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  const mockPaymentRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockExternalPaymentProviderService = {
    create: jest.fn(),
    getPaymentStatusById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PaymentRepository, useValue: mockPaymentRepository },
        { provide: ExternalPaymentProviderService, useValue: mockExternalPaymentProviderService },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a payment and call external service', async () => {
    const dto: PaymentCreateDto = {
      amount: 3452,
      currency: 'BRL',
      method: PaymentMethod.PAYPAL,
      productId: '87e9646a-b513-465d-b58d-6df44b9e4925',
    };

    const savedPayment = { id: '12345', ...dto };
    const externalResponse = { tx_id: 'tx_12345', status: 'pending' };

    mockPaymentRepository.save.mockResolvedValue(savedPayment);
    mockExternalPaymentProviderService.create.mockResolvedValue(externalResponse);

    const result = await paymentService.initiatePayment(dto);

    expect(mockPaymentRepository.save).toHaveBeenCalledWith(expect.any(Payment));
    expect(mockExternalPaymentProviderService.create).toHaveBeenCalledWith(savedPayment.id);
    expect(result).toEqual({ paymentId: 'tx_12345', status: 'pending' });
  });

  it('should return all payments', async () => {
    const payments = [
      { paymentId: '12345', status: 'pending' },
      { paymentId: '67890', status: 'processed' },
    ];

    mockPaymentRepository.findAll.mockResolvedValue(payments);

    const result = await paymentService.ListAll();

    expect(mockPaymentRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(payments);
  });

  it('should return payment status when payment exists', async () => {
    const paymentId = '12345';
    const payment = { id: paymentId, status: 'pending' };
    const updatedStatus: PaymentStatusDto = { paymentId, status: 'processed' };

    mockPaymentRepository.findById.mockResolvedValue(payment);
    jest.spyOn(paymentService, 'updatePaymentStatus').mockResolvedValue(updatedStatus);

    const result = await paymentService.ListByPaymentId(paymentId);

    expect(mockPaymentRepository.findById).toHaveBeenCalledWith(paymentId);
    expect(paymentService.updatePaymentStatus).toHaveBeenCalledWith(paymentId);
    expect(result).toEqual(updatedStatus);
  });

  it('should throw NotFoundException when payment does not exist', async () => {
    mockPaymentRepository.findById.mockResolvedValue(null);

    await expect(paymentService.ListByPaymentId('not-found')).rejects.toThrow(NotFoundException);
  });

  it('should update the payment status if it has changed', async () => {
    const paymentId = '12345';
    const existingPayment = { id: paymentId, status: Status.PENDING };
    const externalResponse = { tx_id: paymentId, status: Status.PROCEESED };

    mockPaymentRepository.findById.mockResolvedValue(existingPayment);
    mockExternalPaymentProviderService.getPaymentStatusById.mockResolvedValue(externalResponse);
    mockPaymentRepository.update.mockResolvedValue(undefined);

    const result = await paymentService.updatePaymentStatus(paymentId);

    expect(mockPaymentRepository.findById).toHaveBeenCalledWith(paymentId);
    expect(mockExternalPaymentProviderService.getPaymentStatusById).toHaveBeenCalledWith(paymentId);
    expect(result).toEqual({ paymentId, status: Status.PROCEESED });
  });

  it('should not update the payment status if it is already the same', async () => {
    const paymentId = '12345';
    const existingPayment = { id: paymentId, status: Status.PROCEESED };
    const externalResponse = { tx_id: paymentId, status: Status.PROCEESED };

    mockPaymentRepository.findById.mockResolvedValue(existingPayment);
    mockExternalPaymentProviderService.getPaymentStatusById.mockResolvedValue(externalResponse);

    const result = await paymentService.updatePaymentStatus(paymentId);

    expect(mockPaymentRepository.update).not.toHaveBeenCalled();
    expect(result).toEqual({ paymentId, status: Status.PROCEESED });
  });

  it('should throw NotFoundException when updating a non-existent payment', async () => {
    mockPaymentRepository.findById.mockResolvedValue(null);

    await expect(paymentService.updatePaymentStatus('not-found')).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if external API fails to return status', async () => {
    const paymentId = '12345';
    const existingPayment = { id: paymentId, status: Status.PENDING };

    mockPaymentRepository.findById.mockResolvedValue(existingPayment);
    mockExternalPaymentProviderService.getPaymentStatusById.mockResolvedValue(null);

    await expect(paymentService.updatePaymentStatus(paymentId)).rejects.toThrow(BadRequestException);
  });
});
