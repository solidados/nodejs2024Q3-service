import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}

  // findAll() {
  //   return this.databaseService.getFavorites();
  // }
  findAll() {
    const favorites = this.databaseService.getFavorites();
    return {
      artists: favorites.artists.map((artist: Artist) =>
        this.databaseService.getArtistById(artist.id),
      ),
      albums: favorites.albums.map((album: Album) =>
        this.databaseService.getAlbumById(album.id),
      ),
      tracks: favorites.tracks.map((track: Track) =>
        this.databaseService.getTrackById(track.id),
      ),
    };
  }

  addArtistToFavorites(id: string) {
    if (!this.databaseService.isFavoriteExist(id, 'artists')) {
      throw new UnprocessableEntityException({
        message: `Artist with id: ${id} does not exist`,
        code: 'NOT_EXIST',
      });
    }
    this.databaseService.addFavorite(id, 'artists');
  }

  addAlbumToFavorites(id: string) {
    if (!this.databaseService.isFavoriteExist(id, 'albums')) {
      throw new UnprocessableEntityException({
        message: `Album with id: ${id} does not exist`,
        code: 'NOT_EXIST',
      });
    }
    this.databaseService.addFavorite(id, 'albums');
  }

  addTrackToFavorites(id: string) {
    if (!this.databaseService.isFavoriteExist(id, 'tracks')) {
      throw new UnprocessableEntityException({
        message: `Track with id: ${id} does not exist`,
        code: 'NOT_EXIST',
      });
    }
    this.databaseService.addFavorite(id, 'tracks');
  }

  deleteArtistFromFavorites(id: string) {
    this.databaseService.deleteFavorites(id, 'artists');
  }

  deleteAlbumFromFavorites(id: string) {
    this.databaseService.deleteFavorites(id, 'albums');
  }

  deleteTrackFromFavorites(id: string) {
    this.databaseService.deleteFavorites(id, 'tracks');
  }
}
