import { Injectable, Logger } from '@nestjs/common';
import { ExternalPaymentStatusDto } from 'src/app/payment/dto/external-payment-status.dto';
import { Status } from 'src/app/payment/enum/payment-enum';

@Injectable()
export class ExternalPaymentProviderService {
  private readonly logger = new Logger(ExternalPaymentProviderService.name);

  async create(paymentId: string) {
    this.logger.log(`Mocking payment request for paymentId: ${paymentId}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      tx_id: paymentId,
      status: Status.PROCEESED,
    };
  }

  async getPaymentStatusById(paymentId: string): Promise<ExternalPaymentStatusDto> {
    this.logger.log(`Mocking payment request for paymentId: ${paymentId}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      tx_id: paymentId,
      status: Status.PROCEESED,
    };
  }
}
