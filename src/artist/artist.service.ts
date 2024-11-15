import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';

import { CreateArtistDto } from './dto/createArtist.dto';
import { UpdateArtistDto } from './dto/updateArtist.dto';

import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  private readonly NotFound = {
    status: 404,
    message: 'Artist not found',
    code: 'NOT_FOUND',
  };

  constructor(private readonly prismaService: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = await this.prismaService.artist.create({
      data: {
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });

    return plainToInstance(Artist, artist);
  }

  async findAll(): Promise<Artist[]> {
    const artists: Artist[] = await this.prismaService.artist.findMany();
    return artists.map((artist: Artist) => plainToInstance(Artist, artist));
  }

  async findOne(id: string): Promise<Artist> {
    const artist: Artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) throw new NotFoundException(this.NotFound);

    return plainToInstance(Artist, artist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist: Artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) throw new NotFoundException(this.NotFound);

    // if (updateArtistDto.name !== undefined) {
    //   artist.name = updateArtistDto.name;
    // }
    // if (updateArtistDto.grammy !== undefined) {
    //   artist.grammy = updateArtistDto.grammy;
    // }

    const updatedArtist: Artist = await this.prismaService.artist.update({
      where: { id },
      data: updateArtistDto,
    });

    return plainToInstance(Artist, updatedArtist);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prismaService.artist.delete({ where: { id } });
    } catch (error) {
      console.error('Error deleting artist:', error.message);
      throw new NotFoundException(this.NotFound);
    }
  }
}
