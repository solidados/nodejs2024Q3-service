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
import { AuthGuard, Public } from './auth.guard';
import { Auth } from './entity/auth.entity';
import { AuthDto } from './dto/auth.dto';

import { User } from '../user/entities/user.entity';

import { ValidationTokenPipe } from '../token/token.pipe';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() authDto: AuthDto): Promise<User> {
    return await this.authService.singUp(authDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() authDto: AuthDto): Promise<Auth> {
    return await this.authService.logIn(authDto);
  }

  @Post('refresh')
  @Public()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationTokenPipe())
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<Auth> {
    return await this.authService.refresh(refreshTokenDto);
  }

  /*@UseGuards(AuthGuard)
  @Get('me')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req) {
    return await req.user;
  }*/
}
