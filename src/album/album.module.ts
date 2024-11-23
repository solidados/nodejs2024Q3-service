import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
