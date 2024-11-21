import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class TokenService {
  jwtSecretKey: string;
  jwtSecretRefreshKey: string;
  tokenExpireTime: string;
  tokenRefreshExpireTime: string;

  private readonly logger: Logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecretKey = this.configService.get<string>(
      'JWT_SECRET_KEY',
      'secret123123',
    );
    this.jwtSecretRefreshKey = this.configService.get<string>(
      'JWT_SECRET_REFRESH_KEY',
      'secret123123',
    );
    this.tokenExpireTime = this.configService.get<string>(
      'TOKEN_EXPIRE_TIME',
      '1h',
    );
    this.tokenRefreshExpireTime = this.configService.get<string>(
      'TOKEN_REFRESH_EXPIRE_TIME',
      '24h',
    );

    if (!this.jwtSecretKey) {
      this.logger.error(
        'JWT_SECRET_KEY is not defined in environment variables',
      );
      throw new Error('JWT_SECRET_KEY is required');
    }
    if (!this.jwtSecretRefreshKey) {
      this.logger.error(
        'JWT_SECRET_REFRESH_KEY is not defined in environment variables',
      );
      throw new Error('JWT_SECRET_REFRESH_KEY is required');
    }
  }

  async getTokens(
    payload: TokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken: string = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecretKey,
      expiresIn: this.tokenExpireTime,
    });
    const refreshToken: string = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecretRefreshKey,
      expiresIn: this.tokenRefreshExpireTime,
    });

    return { accessToken, refreshToken };
  }

  async validateAccessToken(token: string): Promise<TokenDto | null> {
    try {
      return await this.jwtService.verifyAsync<TokenDto>(token, {
        secret: this.jwtSecretKey,
      });
    } catch (error) {
      this.logger.error('Invalid access token', error.stack);
      return null;
    }
  }

  async validateRefreshToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const { userId, login } = await this.jwtService.verifyAsync<TokenDto>(
        token,
        {
          secret: this.jwtSecretRefreshKey,
        },
      );
      const payload = { userId, login };
      return await this.getTokens(payload);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      return null;
    }
  }
}
