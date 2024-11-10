import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService, DatabaseService],
  exports: [DatabaseService],
})
export class TrackModule {}
