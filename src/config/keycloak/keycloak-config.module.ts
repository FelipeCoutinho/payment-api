import { Global, Module } from '@nestjs/common';
import { KeycloakConfigService } from './keycloak-config.service';

@Global()
@Module({
  exports: [KeycloakConfigService],
  providers: [KeycloakConfigService],
})
export class KeycloakConfigModule {}
