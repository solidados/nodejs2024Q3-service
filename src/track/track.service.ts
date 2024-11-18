import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';

import { Track } from './entities/track.entity';
import { Track as PrismaTrack } from '@prisma/client';

@Injectable()
export class TrackService {
  private readonly NotFound = {
    status: 404,
    message: 'Track not found',
    code: 'NOT_FOUND',
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track: PrismaTrack = await this.prisma.track.create({
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
    const tracks: PrismaTrack[] = await this.prisma.track.findMany();
    return tracks.map((track: PrismaTrack) => plainToInstance(Track, track));
  }

  async findOne(id: string): Promise<Track> {
    const track: PrismaTrack = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException(this.NotFound);
    }

    return plainToInstance(Track, track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track: PrismaTrack = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!track) throw new NotFoundException(this.NotFound);

    const updatedTrack: PrismaTrack = await this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });

    return plainToInstance(Track, updatedTrack);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.track.delete({ where: { id } });
    } catch {
      throw new NotFoundException(this.NotFound);
    }
  }
}
