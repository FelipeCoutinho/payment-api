import { Module } from '@nestjs/common';
import { ExternalPaymentProviderModule } from './ExternalPaymentProvider/externalPaymentProvider-resource.module';

@Module({
  imports: [ExternalPaymentProviderModule],
  exports: [ExternalPaymentProviderModule],
})
export class ResourceModule { }
