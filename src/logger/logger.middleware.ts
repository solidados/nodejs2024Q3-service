import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(LoggerMiddleware.name);

  use(request: Request, response: Response, next: NextFunction): void {
    const { query, body, method, originalUrl, ip } = request;

    response.on('finish', () => {
      const message: string = `${method} - Route: ${originalUrl} - StatusCode: ${response.statusCode} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)} - IP: ${ip}`;

      if (response.statusCode >= 400 && response.statusCode < 500) {
        this.logger.warn(message);
      } else if (response.statusCode >= 500) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
