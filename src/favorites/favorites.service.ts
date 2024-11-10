import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll(): void {
    this.databaseService.getFavorites();
  }

  addArtistToFavorites(id: string): void {
    if (!this.databaseService.isFavoriteExist(id, 'artists')) {
      throw new UnprocessableEntityException({
        message: `Artist with id: ${id} does not exist`,
        code: 'NOT_EXIST',
      });
    }
    this.databaseService.addFavorite(id, 'artists');
  }

  addAlbumToFavorites(id: string): void {
    if (!this.databaseService.isFavoriteExist(id, 'albums')) {
      throw new UnprocessableEntityException({
        message: `Album with id: ${id} does not exist`,
        code: 'NOT_EXIST',
      });
    }
    this.databaseService.addFavorite(id, 'albums');
  }

  addTrackToFavorites(id: string): void {
    if (!this.databaseService.isFavoriteExist(id, 'tracks')) {
      throw new UnprocessableEntityException({
        message: `Track with id: ${id} does not exist`,
        code: 'NOT_EXIST',
      });
    }
    this.databaseService.addFavorite(id, 'tracks');
  }

  deleteArtistFromFavorites(id: string): void {
    this.databaseService.deleteFavorites(id, 'artists');
  }

  deleteAlbumFromFavorites(id: string): void {
    this.databaseService.deleteFavorites(id, 'albums');
  }

  deleteTrackFromFavorites(id: string): void {
    this.databaseService.deleteFavorites(id, 'tracks');
  }
}
