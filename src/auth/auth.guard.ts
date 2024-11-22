import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../token/token.service';

import { Request } from 'express';
import { TokenDto } from '../token/dto/token.dto';

export const IS_PUBLIC_ROUTE_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_ROUTE_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly Unauthorized = {
    status: 401,
    message: 'Access token is missing or invalid',
    code: 'UNAUTHORIZED',
  };

  private logger: Logger = new Logger(AuthGuard.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeaders(request);

    if (!token) throw new UnauthorizedException(this.Unauthorized);

    try {
      const tokenPayload: TokenDto | null =
        await this.tokenService.validateAccessToken(token);

      if (!tokenPayload) throw new UnauthorizedException(this.Unauthorized);

      // TODO: if this will be necessary (but first uncomment @Get in auth.controller)
      // request.user = tokenPayload;
    } catch (error) {
      this.logger.error(
        `Token validation error: ${error.message}`,
        error.stack || 'No stack trace available',
      );
      throw new UnauthorizedException(this.Unauthorized);
    }

    return true;
  }

  private extractTokenFromHeaders(request: Request): string {
    const authorization = request.headers.authorization;

    if (!authorization) throw new UnauthorizedException(this.Unauthorized);

    const [type, token] = request.headers.authorization?.split(' ');

    if (type === 'Bearer' && !token)
      throw new UnauthorizedException(this.Unauthorized);

    return token;
  }
}
