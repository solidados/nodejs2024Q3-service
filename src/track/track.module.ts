import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
