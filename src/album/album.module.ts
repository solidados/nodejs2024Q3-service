import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, DatabaseService],
  exports: [DatabaseService],
})
export class AlbumModule {}
