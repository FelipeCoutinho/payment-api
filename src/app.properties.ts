import * as process from 'process';
import { PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';

export default () => ({
  port: parseInt(String(process.env.PORT), 10) || 3000,
  globalPrefix: String(process.env.GLOBAL_PREFIX || ''),
  contextPath: process.env.CONTEXT_PATH || '',
  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL || '',
    migrationsTableName: 'migrations',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    logging: Boolean(process.env.DATABASE_LOGGING || false),
    synchronize: false,
    runMigrationsOnStartup: Boolean(process.env.DATABASE_RUN_MIGRATION_ON_STARTUP || false),
  },
  microservice: {
    attachmentUrl: String(process.env.MS_ATTACHMENT_URL || ''),
    mailerUrl: String(process.env.MS_MAILER_URL || ''),
  },
  keycloakConfig: {
    authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL || '',
    realm: process.env.KEYCLOAK_REALM || '',
    clientId: process.env.KEYCLOAK_CLIENT_ID || '',
    secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    policyEnforcement: process.env.KEYCLOAK_POLICY_ENFORCEMENT || PolicyEnforcementMode.ENFORCING,
    tokenValidation: process.env.KEYCLOAK_TOKEN_VALIDATION || TokenValidation.ONLINE,
    emailLifespan: +process.env.KEYCLOAK_EMAIL_LIFESPAN || 172800,
    paymentRoles: {
      payment: process.env.KEYCLOAK_payment_ROLE_NAME || 'giro-payment',
      PRODUCER: process.env.KEYCLOAK_PRODUCER_ROLE_NAME || 'giro-producer',
      INDUSTRIAL_CONSUMER: process.env.KEYCLOAK_INDUSTRIAL_CONSUMER_ROLE_NAME || 'giro-industrial-consumer',
      CITY: process.env.KEYCLOAK_CITY_ROLE_NAME || 'giro-city',
    },
  },
  keycloakAdminConfig: {
    username: process.env.KEYCLOAK_ADMIN_USER || '',
    password: process.env.KEYCLOAK_ADMIN_PASS || '',
    grantType: process.env.KEYCLOAK_GRANT_TYPE || 'password',
    clientId: process.env.KEYCLOAK_CLIENT_ID || '',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
  },
});
