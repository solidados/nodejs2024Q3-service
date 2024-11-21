import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.public.decorator';
import { AuthDto } from './dto/auth.dto';
import { User } from '../user/entities/user.entity';
import { Auth } from './entity/auth.entity';
import { ValidationTokenPipe } from '../token/token.pipe';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() authDto: AuthDto): Promise<User> {
    return await this.authService.singUp(authDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async logIn(@Body() authDto: AuthDto): Promise<Auth> {
    return await this.authService.logIn(authDto);
  }

  @Public()
  @Post('refresh')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationTokenPipe())
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<Auth> {
    return await this.authService.refresh(refreshTokenDto);
  }

  /*@UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }*/
}
