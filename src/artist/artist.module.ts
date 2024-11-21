import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
