import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class TokenService {
  jwtSecretKey: string;
  jwtSecretRefreshKey: string;
  tokenExpireTime: string;
  tokenRefreshExpireTime: string;

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
  }

  async getTokens(payload: TokenDto): Promise<string[]> {
    const accessToken: string = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecretKey,
      expiresIn: this.tokenExpireTime,
    });
    const refreshToken: string = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecretRefreshKey,
      expiresIn: this.tokenRefreshExpireTime,
    });

    return [accessToken, refreshToken];
  }

  async validateAccessToken(token: string): Promise<TokenDto> {
    const { userId, login } = await this.jwtService.verifyAsync<TokenDto>(
      token,
      { secret: this.jwtSecretKey },
    );

    return { userId, login };
  }

  async validateRefreshToken(token: string) {
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
      console.error(error.message);
      return null;
    }
  }
}
