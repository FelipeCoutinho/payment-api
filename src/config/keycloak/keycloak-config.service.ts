import { Injectable } from '@nestjs/common';
import { KeycloakConnectOptions, KeycloakConnectOptionsFactory } from 'nest-keycloak-connect';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  constructor(readonly configService: ConfigService) {}

  createKeycloakConnectOptions(): KeycloakConnectOptions {
    const opt = this.configService.get<KeycloakConnectOptions>('keycloakConfig');
    return opt;
  }
}
