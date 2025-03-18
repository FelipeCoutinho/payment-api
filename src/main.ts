import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import appDataSource from './app.ormconfig';

const validationPipe: ValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
});

async function initializeSwagger(
  app: INestApplication<AppModule>,
  globalPrefix?: string,
  configService?: ConfigService,
) {
  globalPrefix = globalPrefix || '';

  const logger = new Logger();
  const contextPath: string = configService?.get<string>('contextPath') || '';

  const config = new DocumentBuilder()
    .setTitle('Payment API')
    .setVersion('1.0')
    .addServer(contextPath)
    .addBearerAuth()
    .build();

  const options: SwaggerCustomOptions = {
    jsonDocumentUrl: '/v1/api-docs.json',
    yamlDocumentUrl: '/v1/api-docs.yaml',
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/swagger-ui.html`, app, document, options);

  logger.log(`Listening Swagger on context "${contextPath}"`);
}

async function initializeDatabase() {
  await appDataSource.initialize();
  await appDataSource.runMigrations();
  return await appDataSource.destroy();
}

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const databaseConfig = configService.get('database');
  if (databaseConfig.runMigrationsOnStartup) {
    await initializeDatabase();
  }

  app.useGlobalPipes(validationPipe);

  const globalPrefix: string | undefined = configService.get<string>('globalPrefix');
  app.setGlobalPrefix(globalPrefix || 'api/v1');
  logger.log(`Global Prefix ${globalPrefix}`);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await initializeSwagger(app, globalPrefix, configService);

  const port = Number(configService.get('port'));

  await app.listen(port);
  logger.log(`Listening on http://localhost:${port}/${globalPrefix}`);
}

bootstrap().then(() => { });
