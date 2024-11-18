import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';

import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';

import { Album as PrismaAlbum } from '@prisma/client';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  private readonly NotFound = {
    status: 404,
    message: 'Album not found',
    code: 'NOT_FOUND',
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album: PrismaAlbum = await this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId,
      },
    });

    return plainToInstance(Album, album);
  }

  async findAll(): Promise<Album[]> {
    const albums: PrismaAlbum[] = await this.prisma.album.findMany();
    return albums.map((album: PrismaAlbum) => plainToInstance(Album, album));
  }

  async findOne(id: string): Promise<Album> {
    const album: PrismaAlbum = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) throw new NotFoundException(this.NotFound);

    return plainToInstance(Album, album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album: PrismaAlbum = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) throw new NotFoundException(this.NotFound);

    const updatedAlbum: PrismaAlbum = await this.prisma.album.update({
      where: { id },
      data: updateAlbumDto,
    });

    return plainToInstance(Album, updatedAlbum);
  }

  async delete(id: string): Promise<void> {
    const album: PrismaAlbum = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) throw new NotFoundException(this.NotFound);

    await this.prisma.album.delete({ where: { id } });
  }
}
