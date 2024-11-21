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
  private readonly UnAuthorized = {
    status: 401,
    message: 'Refresh token is missing',
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
    return await this.userService.create(authDto);
  }

  async logIn(authDto: AuthDto): Promise<Auth> {
    const isPasswordValid: boolean = await this.userService.isValidPassword(
      authDto.login,
      authDto.password,
    );
    if (!isPasswordValid) throw new ForbiddenException(this.NotValid);

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
      throw new UnauthorizedException(this.UnAuthorized);

    try {
      const { accessToken, refreshToken } =
        await this.tokenService.validateRefreshToken(
          refreshTokenDto.refreshToken,
        );

      return plainToInstance(Auth, { accessToken, refreshToken });
    } catch (error) {
      console.error(error.message);
    }
  }
}
