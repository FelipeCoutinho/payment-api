import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

import { ResourceModule } from '../../resource/resource.module';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakConfigService } from '../../config/keycloak/keycloak-config.service';
import { KeycloakConfigModule } from '../../config/keycloak/keycloak-config.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './payment.repository';

@Module({
  exports: [PaymentService],
  imports: [
    TypeOrmModule.forFeature([Payment]),
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeycloakConfigModule],
    }),
    ResourceModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
})
export class PaymentModule { }
