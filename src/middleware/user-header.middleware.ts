import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserHeaderMiddleware implements NestMiddleware {
  private logger = new Logger('UserHeaderMiddleware');

  async use(request: Request, _response: Response, next: NextFunction): Promise<void> {
    if (!request.headers['x-api-key'] || request.headers['x-api-key'] !== process.env.API_KEY) {
      this.logger.error('Invalid API Key');
      throw new UnauthorizedException('Invalid API Key');
    }

    next();
  }
}
