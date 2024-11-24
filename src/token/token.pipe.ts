import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../auth/dto/refreshToken.dto';

@Injectable()
export class ValidationTokenPipe implements PipeTransform {
  private static readonly UNAUTHORIZED_ERROR = {
    status: 401,
    message: 'Unauthorized: token is missing or invalid.',
    code: 'UNAUTHORIZED_TOKEN',
  };

  public transform(value: RefreshTokenDto): RefreshTokenDto {
    if (
      !value ||
      typeof value.refreshToken !== 'string' ||
      value.refreshToken.trim() === ''
    )
      throw new UnauthorizedException(ValidationTokenPipe.UNAUTHORIZED_ERROR);
    return value;
  }
}
