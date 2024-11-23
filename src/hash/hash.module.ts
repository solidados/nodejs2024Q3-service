import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashService } from './hash.service';

@Module({
  imports: [ConfigModule],
  providers: [HashService, ConfigService],
  exports: [HashService],
})
export class HashModule {}
