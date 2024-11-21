import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ValidationTokenPipe implements PipeTransform {
  private static readonly UNAUTHORIZED_ERROR = {
    status: 401,
    message: 'Unauthorized: token is missing or invalid.',
    code: 'UNAUTHORIZED_TOKEN',
  };

  public transform(value: string): string {
    if (typeof value !== 'string' || value.trim() === '')
      throw new UnauthorizedException(ValidationTokenPipe.UNAUTHORIZED_ERROR);
    return value;
  }
}
