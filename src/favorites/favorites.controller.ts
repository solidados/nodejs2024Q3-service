import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('/artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtistToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favoritesService.addArtistToFavorites(id);
  }

  @Post('/album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbumToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favoritesService.addAlbumToFavorites(id);
  }

  @Post('/track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrackToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favoritesService.addTrackToFavorites(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Delete('/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtistFromFavorites(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.favoritesService.deleteArtistFromFavorites(id);
  }

  @Delete('/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbumFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favoritesService.deleteAlbumFromFavorites(id);
  }

  @Delete('/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrackFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favoritesService.deleteTrackFromFavorites(id);
  }
}
