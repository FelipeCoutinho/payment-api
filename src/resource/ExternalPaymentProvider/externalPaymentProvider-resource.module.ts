import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ExternalPaymentProviderService } from './externalPaymentProvider-resource.service';

@Module({
  exports: [ExternalPaymentProviderService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('microservice.PaymentUrl'),
        timeout: configService.get<number>('httpTimeout'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ExternalPaymentProviderService],
})
export class ExternalPaymentProviderModule { }
