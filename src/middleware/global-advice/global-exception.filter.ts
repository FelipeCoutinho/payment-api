import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { AxiosError } from 'axios';
import { StateMachineError } from './exception/state-machine.error';
import { ErrorDto } from './dto/error.dto';
import { ValidationException } from './exception/validation-exception.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception?.status || exception?.response?.status || 500;
    const message = exception?.stack || exception?.response || exception?.message || 'Internal server error';

    response.status(status).json(ErrorDto.createErrorMessage(ctx, exception, status, message));
  }
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter<BadRequestException> {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    response.status(status).json(ErrorDto.createErrorMessage(ctx, exception, status));
  }
}

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter<ValidationException> {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(exception.getStatus()).json(exception.getResponse());
  }
}

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter<NotFoundException> {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    response.status(status).json(ErrorDto.createErrorMessage(ctx, exception, status));
  }
}

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter<EntityNotFoundError> {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.NOT_FOUND;
    response.status(status).json(ErrorDto.createErrorMessage(ctx, exception, status));
  }
}

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter<QueryFailedError> {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.BAD_REQUEST;
    let message: string = 'Validation failed';
    let errors: any[];

    if (exception.message.includes('uk_payment_tax_identification_number')) {
      errors = [
        {
          reason: 'Unique Constraint Violation',
          message: 'Tax identification number already exists',
          location: 'organization.tax_identification_number',
          locationType: 'parameter',
        },
      ];
    } else if (exception.message.includes('uk_payments_organization_id_email')) {
      errors = [
        {
          reason: 'Unique Constraint Violation',
          message: 'Email already exists to organization',
          location: 'payment.organization_id and payment.email',
          locationType: 'parameter',
        },
      ];
    } else {
      message = 'Query failed';
    }

    response.status(status).json(ErrorDto.createErrorMessage(ctx, exception, status, message, errors));
  }
}

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter<AxiosError> {
  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: any;
    let errors: any[];

    if (exception?.code == 'ECONNREFUSED') {
      status = HttpStatus.BAD_GATEWAY;
      message = 'Bad gateway';
      errors = (exception as any)?.errors;
    } else {
      status = exception?.response?.status || exception?.status || 500;
      message = exception?.response?.data || exception?.response || exception.message;
    }

    response.status(status).json(ErrorDto.createErrorMessage(ctx, exception, status, message, errors));
  }
}

@Catch(StateMachineError)
export class StateMachineExceptionFilter implements ExceptionFilter<StateMachineError> {
  catch(exception: StateMachineError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.BAD_REQUEST;
    response.status(status).json(ErrorDto.createErrorMessage(ctx, exception, status));
  }
}
