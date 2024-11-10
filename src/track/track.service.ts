import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTrackDto } from './dto/createTrack.dto';
import { Track } from './entities/track.entity';
import { plainToClass } from 'class-transformer';
import { UpdateTrackDto } from './dto/updateTrack.dto';

@Injectable()
export class TrackService {
  constructor(private readonly databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  create(createUserDto: CreateTrackDto): Track {
    const track: Track = new Track(
      createUserDto.name,
      createUserDto.artistId,
      createUserDto.albumId,
      createUserDto.duration,
    );
    this.databaseService.addTrack(track);

    return plainToClass(Track, track);
  }

  findAll(): Track[] {
    return this.databaseService.getTracks();
  }

  findOne(id: string): Track {
    const track: Track = this.databaseService.getTrackById(id);

    if (!track) {
      throw new NotFoundException({ message: 'Track not found' });
    }

    return plainToClass(Track, track);
  }

  update(id: string, updateUserDto: UpdateTrackDto): Track {
    const track: Track = this.databaseService.getTrackById(id);
    if (!track) throw new NotFoundException({ message: 'Track not found' });

    track.name = updateUserDto.name;
    if (updateUserDto.artistId) track.artistId = updateUserDto.artistId;
    if (updateUserDto.albumId) track.albumId = updateUserDto.albumId;
    track.duration = updateUserDto.duration;

    this.databaseService.updateTrack(track);

    return plainToClass(Track, track);
  }

  delete(id: string) {
    const track: Track = this.databaseService.getTrackById(id);
    if (!track) throw new NotFoundException({ message: 'Track not found' });

    return this.databaseService.deleteTrack(id);
  }
}
