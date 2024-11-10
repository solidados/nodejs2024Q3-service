import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoritesDto } from './createFavorites.dto';

export class UpdateFavoritesDto extends PartialType(CreateFavoritesDto) {}
