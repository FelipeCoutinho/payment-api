import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { PaymentCreateDto } from '../dto/payment-create.dto';
import { MapperUtil } from '../../../util/mapper-util';
import { Payment } from '../entities/payment.entity';
import { ExternalPaymentProviderService } from '../../../resource/ExternalPaymentProvider/externalPaymentProvider-resource.service';
import { PaymentStatusDto } from '../dto/payment-status.dto';
import { Status } from '../enum/payment-enum';

@Injectable()
export class PaymentService {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly externalPaymentProviderService: ExternalPaymentProviderService,
  ) { }

  async initiatePayment(dto: PaymentCreateDto) {
    console.log('PaymentService -> initiatePayment -> dto', dto);
    const payment = MapperUtil.castObj(dto, Payment);
    const paymentResult = await this.repository.save(payment);
    const response = await this.externalPaymentProviderService.create(paymentResult.id);
    return { paymentId: response.tx_id, status: response.status };
  }

  async ListAll() {
    console.log('PaymentService -> ListAll');
    const paymentRespose = await this.repository.findAll();
    console.log(paymentRespose);
    return paymentRespose;
  }

  async ListByPaymentId(paymentId: string): Promise<PaymentStatusDto> {
    console.log('PaymentService -> ListByPaymentId -> paymentId', paymentId);

    const paymentRespose = await this.repository.findById(paymentId);

    if (!paymentRespose) {
      throw new NotFoundException('Payment not found');
    }

    const response = await this.updatePaymentStatus(paymentId);

    if (!response) {
      throw new BadRequestException('Payment status not updated');
    }

    return { paymentId: response.paymentId, status: response.status };
  }

  async updatePaymentStatus(paymentId: string): Promise<PaymentStatusDto> {
    console.log('PaymentService -> updatePaymentStatus -> paymentId', paymentId);

    const paymentRespose = await this.repository.findById(paymentId);

    if (!paymentRespose) {
      throw new NotFoundException('Payment not found in the database');
    }

    const ExternalResponse = await this.externalPaymentProviderService.getPaymentStatusById(paymentId);

    if (!ExternalResponse) {
      throw new BadRequestException('Payment status not updated');
    }

    if (paymentRespose.status !== ExternalResponse.status) {
      await this.repository.update(paymentId, { status: ExternalResponse.status as Status });
      return { paymentId: ExternalResponse.tx_id, status: ExternalResponse.status };
    }

    return { paymentId: ExternalResponse.tx_id, status: ExternalResponse.status };
  }
}
