import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(response: any) {
    super(response);
  }
}
