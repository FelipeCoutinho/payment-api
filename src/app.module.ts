import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import properties from './app.properties';
import { HealthModule } from './app/health/health.module';
import { GlobalAdviceModule } from './middleware/global-advice/global-advice.module';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { UserHeaderMiddleware } from './middleware/user-header.middleware';
import { PaymentModule } from './app/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [properties], isGlobal: true }),
    JwtModule.register({ global: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    GlobalAdviceModule,
    HealthModule,
    PaymentModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(UserHeaderMiddleware).forRoutes('*');
  }
}
