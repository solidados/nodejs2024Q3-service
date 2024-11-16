import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const artistsPromise = this.prisma.favoriteArtist.findMany({
      select: { artist: true },
    });
    const albumsPromise = this.prisma.favoriteAlbum.findMany({
      select: { album: true },
    });
    const tracksPromise = this.prisma.favoriteTrack.findMany({
      select: { track: true },
    });

    const [artists, albums, tracks] = await Promise.all([
      artistsPromise,
      albumsPromise,
      tracksPromise,
    ]);

    return {
      artists: artists.map(({ artist }: { artist: Artist }) => artist),
      albums: albums.map(({ album }: { album: Album }) => album),
      tracks: tracks.map(({ track }: { track: Track }) => track),
    };
  }

  async addArtistToFavorites(id: string): Promise<void> {
    try {
      await this.prisma.favoriteArtist.create({
        data: { artistId: id },
      });
    } catch {
      throw new UnprocessableEntityException(this.NoExist(id));
    }
  }

  async addAlbumToFavorites(id: string): Promise<void> {
    try {
      await this.prisma.favoriteAlbum.create({
        data: { albumId: id },
      });
    } catch {
      throw new UnprocessableEntityException(this.NoExist(id));
    }
  }

  async addTrackToFavorites(id: string): Promise<void> {
    try {
      await this.prisma.favoriteTrack.create({
        data: { trackId: id },
      });
    } catch {
      throw new UnprocessableEntityException(this.NoExist(id));
    }
  }

  async deleteArtistFromFavorites(id: string): Promise<void> {
    try {
      await this.prisma.favoriteArtist.delete({
        where: { artistId: id },
      });
    } catch {
      throw new NotFoundException(this.NotFound(id));
    }
  }

  async deleteAlbumFromFavorites(id: string): Promise<void> {
    try {
      await this.prisma.favoriteAlbum.delete({
        where: { albumId: id },
      });
    } catch {
      throw new NotFoundException(this.NotFound(id));
    }
  }

  async deleteTrackFromFavorites(id: string): Promise<void> {
    try {
      await this.prisma.favoriteTrack.delete({
        where: { trackId: id },
      });
    } catch {
      throw new NotFoundException(this.NotFound(id));
    }
  }

  private readonly NoExist = (id: string) => ({
    status: 422,
    message: `Requested entity with id: ${id} does not exist`,
    code: 'NO_EXIST',
  });

  private readonly NotFound = (id: string) => ({
    status: 404,
    message: `Requested entity with id: ${id} not found`,
    code: 'NOT_FOUND',
  });
}
