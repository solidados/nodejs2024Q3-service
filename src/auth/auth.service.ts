import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { AuthDto } from './dto/auth.dto';
import { User } from '../user/entities/user.entity';
import { Auth } from './entity/auth.entity';
import { plainToInstance } from 'class-transformer';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  private readonly Unauthorized = {
    status: 401,
    message: 'Refresh token is missing or invalid',
    code: 'UNAUTHORIZED',
  };

  private readonly NotValid = {
    status: 403,
    message: 'Login or Password is invalid',
    code: 'NOT_VALID',
  };

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async singUp(authDto: AuthDto): Promise<User> {
    const isExistLogin: boolean = await this.userService.isExistLogin(
      authDto.login,
    );

    if (isExistLogin)
      throw new ForbiddenException({
        status: 403,
        message: 'This login is taken',
        code: 'IS_EXIST',
      });

    return await this.userService.create(authDto);
  }

  async logIn(authDto: AuthDto): Promise<Auth> {
    const isValidUser = await this.userService.isValidUser(
      authDto.login,
      authDto.password,
    );

    if (!isValidUser) throw new ForbiddenException(this.NotValid);

    const user = await this.userService.findOneByLogin(authDto.login);
    const { id: userId, login } = user;
    const { accessToken, refreshToken } = await this.tokenService.getTokens({
      userId,
      login,
    });

    return plainToInstance(Auth, { accessToken, refreshToken });
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<Auth> {
    if (!refreshTokenDto.refreshToken)
      throw new UnauthorizedException(this.Unauthorized);

    try {
      const { accessToken, refreshToken } =
        await this.tokenService.validateRefreshToken(
          refreshTokenDto.refreshToken,
        );

      return plainToInstance(Auth, { accessToken, refreshToken });
    } catch (error) {
      console.error('Error during refresh token validation:', error);
      throw new UnauthorizedException(this.Unauthorized);
    }
  }
}
