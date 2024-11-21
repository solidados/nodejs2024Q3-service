import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [TokenService],
  exports: [TokenService, JwtModule],
})
export class TokenModule {}
