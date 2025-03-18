import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import {
  AxiosExceptionFilter,
  BadRequestExceptionFilter,
  EntityNotFoundErrorFilter,
  GlobalExceptionFilter,
  NotFoundExceptionFilter,
  QueryFailedErrorFilter,
  StateMachineExceptionFilter,
  ValidationExceptionFilter,
} from './global-exception.filter';
import { GlobalValidationPipe } from './global-validation.pipe';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: EntityNotFoundErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AxiosExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: StateMachineExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
  ],
})
export class GlobalAdviceModule {}
