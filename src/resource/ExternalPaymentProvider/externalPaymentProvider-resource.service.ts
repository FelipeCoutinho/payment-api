import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ExternalPaymentProviderService {
  private readonly logger = new Logger(ExternalPaymentProviderService.name);

  async create(paymentId: string) {
    this.logger.log(`Mocking payment request for paymentId: ${paymentId}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      paymentId,
      status: 'pending',
    };
  }
}
