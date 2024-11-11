import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { Album } from './entities/album.entity';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AlbumService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createAlbumDto: CreateAlbumDto): Album {
    const album: Album = new Album(
      createAlbumDto.name,
      createAlbumDto.year,
      createAlbumDto.artistId,
    );
    this.databaseService.addAlbum(album);

    return plainToClass(Album, album);
  }

  findAll(): Album[] {
    return this.databaseService.getAlbums();
  }

  findOne(id: string): Album {
    const album: Album = this.databaseService.getAlbumById(id);

    if (!album)
      throw new NotFoundException({
        message: `Album not found`,
        code: 'ALBUM_NOT_FOUND',
      });

    return plainToClass(Album, album);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album: Album = this.databaseService.getAlbumById(id);
    if (!album)
      throw new NotFoundException({
        message: `Album not found`,
        code: 'ALBUM_NOT_FOUND',
      });

    if (updateAlbumDto.name !== undefined) {
      album.name = updateAlbumDto.name;
    }
    if (updateAlbumDto.year !== undefined) {
      album.year = updateAlbumDto.year;
    }
    if (updateAlbumDto.artistId !== undefined) {
      album.artistId = updateAlbumDto.artistId;
    }

    this.databaseService.updateAlbum(album);

    return plainToClass(Album, album);
  }

  delete(id: string) {
    const album: Album = this.databaseService.getAlbumById(id);
    if (!album)
      throw new NotFoundException({
        message: `Album not found`,
        code: 'ALBUM_NOT_FOUND',
      });

    this.databaseService.deleteAlbum(id);
  }
}
