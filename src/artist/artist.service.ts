import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';

import { CreateArtistDto } from './dto/createArtist.dto';
import { UpdateArtistDto } from './dto/updateArtist.dto';

// import { Artist as PrismaArtist } from '@prisma/client';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  private readonly NotFound = {
    status: 404,
    message: 'Artist not found',
    code: 'NOT_FOUND',
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = await this.prisma.artist.create({
      data: {
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });

    return plainToInstance(Artist, artist);
  }

  async findAll(): Promise<Artist[]> {
    const artists: Artist[] = await this.prisma.artist.findMany();
    return artists.map((artist: Artist) => plainToInstance(Artist, artist));
  }

  async findOne(id: string): Promise<Artist> {
    const artist: Artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) throw new NotFoundException(this.NotFound);

    return plainToInstance(Artist, artist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist: Artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) throw new NotFoundException(this.NotFound);

    const updatedArtist: Artist = await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });

    return plainToInstance(Artist, updatedArtist);
  }

  async delete(id: string): Promise<void> {
    const artist: Artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) throw new NotFoundException(this.NotFound);

    await this.prisma.artist.delete({ where: { id } });
  }
}
