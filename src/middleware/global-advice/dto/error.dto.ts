import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';

type ErrorDetail = {
  reason: string;
  message: string;
  location: string;
  locationType: string;
  [s: string]: any;
};

type ErrorDescription = {
  code: number;
  message: string;
  errors?: ErrorDetail[];
  [s: string]: any;
};

export class ErrorDto {
  error: ErrorDescription;
  [s: string]: any;

  static createErrorMessage<T extends Error>(
    ctx: HttpArgumentsHost,
    exception: T,
    code: number,
    message?: any,
    errors?: any[],
  ) {
    const request = ctx.getRequest<Request>();

    message = message || exception.message;
    if (!message) {
      message = (exception as any).response;
      if (message && typeof message != 'string') {
        message = JSON.stringify(message);
      }
    }

    errors = errors?.map((e) => {
      const error = e as ErrorDetail;
      error.reason = e.reason || undefined;
      error.message = e.message || undefined;
      error.location = e.location || undefined;
      error.locationType = e.locationType || undefined;
      return error;
    });

    const error: ErrorDto = {
      error: {
        code: code,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
        errors: errors,
      },
    };
    return error;
  }
}
