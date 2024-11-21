import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ValidationTokenPipe implements PipeTransform {
  private readonly Unauthorized = {
    status: 401,
    message: 'Unauthorized token',
    code: 'UNAUTHORIZED_TOKEN',
  };

  public transform(value: string): string {
    if (!value) throw new UnauthorizedException(this.Unauthorized);
    return value;
  }
}
