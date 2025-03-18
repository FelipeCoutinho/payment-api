import { Expose } from 'class-transformer';

export class ExternalPaymentProviderResponseDto {
  @Expose()
  paymentId: string;

  @Expose()
  statua: string;
}
