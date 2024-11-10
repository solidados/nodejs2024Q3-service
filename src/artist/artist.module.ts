import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, DatabaseService],
  exports: [DatabaseService],
})
export class ArtistModule {}
