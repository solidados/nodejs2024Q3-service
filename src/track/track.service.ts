import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';

import { Track } from './entities/track.entity';
// import { Track as PrismaTrack } from '@prisma/client';

@Injectable()
export class TrackService {
  private readonly NotFound = {
    status: 404,
    message: 'Track not found',
    code: 'NOT_FOUND',
  };

  constructor(private readonly prismaService: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track: Track = await this.prismaService.track.create({
      data: {
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
        duration: createTrackDto.duration,
      },
    });

    return plainToInstance(Track, track);
  }

  async findAll(): Promise<Track[]> {
    const tracks: Track[] = await this.prismaService.track.findMany();
    return tracks.map((track: Track) => plainToInstance(Track, track));
  }

  async findOne(id: string): Promise<Track> {
    const track: Track = await this.prismaService.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException(this.NotFound);
    }

    return plainToInstance(Track, track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track: Track = this.prismaService.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(this.NotFound);

    const updatedTrack = await this.prismaService.track.update({
      where: { id },
      data: updateTrackDto,
    });
    // track.name = updateTrackDto.name;
    // if (updateTrackDto.artistId) track.artistId = updateTrackDto.artistId;
    // if (updateTrackDto.albumId) track.albumId = updateTrackDto.albumId;
    // track.duration = updateTrackDto.duration;
    //
    // this.prismaService.updateTrack(track);

    return plainToInstance(Track, updatedTrack);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prismaService.track.delete({ where: { id } });
    } catch {
      throw new NotFoundException(this.NotFound);
    }
  }
}
