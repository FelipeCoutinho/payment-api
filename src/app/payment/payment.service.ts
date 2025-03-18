import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { PaymentCreateDto } from './dto/payment-create.dto';
import { MapperUtil } from 'src/util/mapper-util';
import { Payment } from './entities/payment.entity';
import { ExternalPaymentProviderService } from 'src/resource/ExternalPaymentProvider/externalPaymentProvider-resource.service';
import { PaymentStatusDto } from './dto/payment-status.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly externalPaymentProviderService: ExternalPaymentProviderService,
  ) { }

  async initiatePayment(dto: PaymentCreateDto) {
    const payment = MapperUtil.castObj(dto, Payment);
    console.log(payment);
    const paymentResult = await this.repository.save(payment);

    const response = await this.externalPaymentProviderService.create(paymentResult.id);
    return response;
  }

  async ListAll() {
    const paymentRespose = await this.repository.findAll();
    console.log(paymentRespose);
    return paymentRespose;
  }
  async ListByPaymentId(paymentId: string): Promise<PaymentStatusDto> {
    const paymentRespose = await this.repository.findById(paymentId);

    return { paymentId: paymentRespose.id, status: paymentRespose.status };
  }
}
