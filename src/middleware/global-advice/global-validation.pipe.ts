import { ArgumentMetadata, Injectable, PipeTransform, ValidationError } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from './exception/validation-exception.error';
import { ErrorDto } from './dto/error.dto';

@Injectable()
export class GlobalValidationPipe implements PipeTransform {
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (type === 'body') {
      const object = plainToInstance(metatype, value);
      const errors = await validate(object);
      if (errors.length > 0) {
        throw new ValidationException(this.formatErrors(errors));
      }
    }
    return value;
  }

  private formatErrors(errors: ValidationError[]) {
    return {
      error: {
        code: 400,
        message: 'Validation failed',
        errors: errors.map((error) => ({
          reason: 'invalid',
          message: Object.values(error.constraints).join(', '),
          location: error.property,
          locationType: 'body',
        })),
      },
    } as ErrorDto;
  }
}
