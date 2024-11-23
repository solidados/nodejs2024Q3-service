import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const timestamp = new Date().toISOString();
    const { httpAdapter } = this.httpAdapterHost;
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: string =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error occurred';

    const path = httpAdapter.getRequestUrl(request);

    const errorMessage: string = `${request.method} - StatusCode: ${status} - Message: ${message}`;
    this.logger.error(errorMessage, (exception as HttpException).stack);

    const responseBody = { status, path, message, timestamp };
    httpAdapter.reply(response, responseBody, status);
  }
}
