import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';

import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';

import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  private readonly NotFound = {
    status: 404,
    message: 'Album not found',
    code: 'NOT_FOUND',
  };

  constructor(private readonly prismaService: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album: Album = await this.prismaService.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId,
      },
    });

    return plainToInstance(Album, album);
  }

  async findAll(): Promise<Album[]> {
    const albums: Album[] = await this.prismaService.album.findMany();
    return albums.map((album: Album) => plainToInstance(Album, album));
  }

  async findOne(id: string): Promise<Album> {
    const album: Album = await this.prismaService.album.findUnique({
      where: { id },
    });

    if (!album) throw new NotFoundException(this.NotFound);

    return plainToInstance(Album, album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album: Album = this.prismaService.album.findUnique({
      where: { id },
    });
    if (!album) throw new NotFoundException(this.NotFound);

    const updatedAlbum = await this.prismaService.album.update({
      where: { id },
      data: updateAlbumDto,
    });

    // if (updateAlbumDto.name !== undefined) {
    //   album.name = updateAlbumDto.name;
    // }
    // if (updateAlbumDto.year !== undefined) {
    //   album.year = updateAlbumDto.year;
    // }
    // if (updateAlbumDto.artistId !== undefined) {
    //   album.artistId = updateAlbumDto.artistId;
    // }

    return plainToInstance(Album, updatedAlbum);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prismaService.album.delete({ where: { id } });
    } catch {
      throw new NotFoundException(this.NotFound);
    }
  }
}
