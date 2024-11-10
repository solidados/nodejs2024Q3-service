import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateArtistDto } from './dto/createArtist.dto';
import { Artist } from './entities/artist.entity';
import { plainToClass } from 'class-transformer';
import { UpdateArtistDto } from './dto/updateArtist.dto';

@Injectable()
export class ArtistService {
  constructor(private readonly databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const artist: Artist = new Artist(
      createArtistDto.name,
      createArtistDto.grammy,
    );
    this.databaseService.addArtist(artist);

    return plainToClass(Artist, artist);
  }

  findAll(): Artist[] {
    return this.databaseService.getArtists();
  }

  findOne(id: string): Artist {
    const artist: Artist = this.databaseService.getArtistById(id);
    if (!artist)
      throw new NotFoundException({
        message: 'Artist not found',
        code: 'ARTIST_NOT_FOUND',
      });

    return plainToClass(Artist, artist);
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist: Artist = this.databaseService.getArtistById(id);

    if (!artist)
      throw new NotFoundException({
        message: 'Artist not found',
        code: 'ARTIST_NOT_FOUND',
      });

    if (updateArtistDto.name !== undefined) {
      artist.name = updateArtistDto.name;
    }
    if (updateArtistDto.grammy !== undefined) {
      artist.grammy = updateArtistDto.grammy;
    }

    this.databaseService.updateArtist(artist);

    return plainToClass(Artist, artist);
  }

  delete(id: string): void {
    const artist: Artist = this.databaseService.getArtistById(id);
    if (!artist)
      throw new NotFoundException({
        message: 'Artist not found',
        code: 'ARTIST_NOT_FOUND',
      });

    this.databaseService.deleteArtist(id);
  }
}
