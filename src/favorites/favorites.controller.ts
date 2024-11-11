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
  addArtistToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addArtistToFavorites(id);
  }

  @Post('/album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addAlbumToFavorites(id);
  }

  @Post('/track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addTrackToFavorites(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.favoritesService.findAll();
  }

  @Delete('/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtistFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.deleteArtistFromFavorites(id);
  }

  @Delete('/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbumFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.deleteAlbumFromFavorites(id);
  }

  @Delete('/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrackFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.deleteTrackFromFavorites(id);
  }
}
