import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Favorites } from '../favorites/entities/favorites.entity';

@Injectable()
export class DatabaseService {
  private readonly users: User[] = [];
  private readonly tracks: Track[] = [];
  private readonly artists: Artist[] = [];
  private readonly albums: Album[] = [];
  private readonly favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  /** - `Add` block */
  addUser(user: User): void {
    this.users.push(user);
  }

  addTrack(track: Track): void {
    this.tracks.push(track);
  }

  addArtist(artist: Artist): void {
    this.artists.push(artist);
  }

  addAlbum(album: Album): void {
    this.albums.push(album);
  }

  addFavorite(id: string, type: 'artists' | 'albums' | 'tracks') {
    switch (type) {
      case 'artists':
        this.favorites.artists.push(id);
        break;
      case 'albums':
        this.favorites.albums.push(id);
        break;
      case 'tracks':
        this.favorites.tracks.push(id);
        break;
    }
  }

  /** - `Get All` block */
  getUsers(): User[] {
    return this.users;
  }

  getTracks(): Track[] {
    return this.tracks;
  }

  getArtists(): Artist[] {
    return this.artists;
  }

  getAlbums(): Album[] {
    return this.albums;
  }

  getFavorites = () => ({
    artists: this.artists.filter((artist: Artist) =>
      this.favorites.artists.includes(artist.id),
    ),
    albums: this.albums.filter((album: Album) =>
      this.favorites.artists.includes(album.id),
    ),
    tracks: this.tracks.filter((track: Track) =>
      this.favorites.tracks.includes(track.id),
    ),
  });

  /** - `Get One by ID` block */
  getUserById(id: string): User | undefined {
    return this.users.find((usr: User): boolean => usr.id === id);
  }

  getTrackById(id: string): Track | undefined {
    return this.tracks.find((trk: Track): boolean => trk.id === id);
  }

  getArtistById(id: string): Artist | undefined {
    return this.artists.find((art: Artist): boolean => art.id === id);
  }

  getAlbumById(id: string): Album | undefined {
    return this.albums.find((alb: Album): boolean => alb.id === id);
  }

  /** - `Update` block */
  updateUser(user: User): boolean {
    const index: number = this.users.findIndex(
      (usr: User): boolean => usr.id === user.id,
    );
    if (index === -1)
      throw new NotFoundException({
        message: `User with ID ${user.id} not found.`,
        code: 'ID_NOT_FOUND',
      });
    this.users[index] = user;

    return true;
  }

  updateTrack(track: Track): boolean {
    const index: number = this.tracks.findIndex(
      (trk: Track): boolean => trk.id === track.id,
    );
    if (index === -1)
      throw new NotFoundException({
        message: `Track with ID ${track.id} not found.`,
        code: 'ID_NOT_FOUND',
      });
    this.tracks[index] = track;

    return true;
  }

  updateArtist(artist: Artist): boolean {
    const index: number = this.artists.findIndex(
      (art: Artist): boolean => art.id === artist.id,
    );
    if (index === -1)
      throw new NotFoundException({
        message: `Artist with ID ${artist.id} not found.`,
        code: 'ID_NOT_FOUND',
      });
    this.artists[index] = artist;

    return true;
  }

  updateAlbum(album: Album): boolean {
    const index: number = this.albums.findIndex(
      (alb: Album): boolean => alb.id === album.id,
    );
    if (index === -1)
      throw new NotFoundException({
        message: `Album with ID ${album.id} not found.`,
        code: 'ID_NOT_FOUND',
      });
    this.albums[index] = album;

    return true;
  }

  /** - `Delete` block */
  deleteUser(id: string): boolean {
    const index: number = this.users.findIndex(
      (usr: User): boolean => usr.id === id,
    );
    if (index === -1)
      throw new NotFoundException({
        message: `User with ID ${id} not found.`,
        code: 'ID_NOT_FOUND',
      });
    this.users.splice(index, 1);

    return true;
  }

  deleteTrack(id: string): boolean {
    const index: number = this.tracks.findIndex(
      (trk: Track): boolean => trk.id === id,
    );
    if (index === -1)
      throw new NotFoundException({
        message: `Track with ID ${id} not found.`,
        code: 'ID_NOT_FOUND',
      });
    this.favorites.tracks = this.favorites.tracks.filter(
      (favTrackId): boolean => favTrackId !== id,
    );
    this.tracks.splice(index, 1);

    return true;
  }

  deleteArtist(id: string): boolean {
    const index: number = this.artists.findIndex(
      (art: Artist): boolean => art.id === id,
    );
    if (index === -1)
      throw new NotFoundException({
        message: `Artist with ID ${id} not found.`,
        code: 'ID_NOT_FOUND',
      });

    this.tracks.forEach((track: Track): void => {
      if (track.artistId === id) track.artistId = null;
    });

    this.albums.forEach((album: Album): void => {
      if (album.artistId === id) album.artistId = null;
    });

    this.favorites.artists = this.favorites.artists.filter(
      (favArtistId): boolean => favArtistId !== id,
    );

    this.artists.splice(index, 1);

    return true;
  }

  deleteAlbum(id: string): boolean {
    const index: number = this.albums.findIndex(
      (alb: Album): boolean => alb.id === id,
    );
    if (index === -1)
      throw new NotFoundException({
        message: `Album with ID ${id} not found.`,
        code: 'ID_NOT_FOUND',
      });

    this.tracks.forEach((track: Track): void => {
      if (track.albumId === id) track.albumId = null;
    });

    this.favorites.albums = this.favorites.albums.filter(
      (favAlbumId): boolean => favAlbumId !== id,
    );

    this.albums.splice(index, 1);

    return true;
  }

  deleteFavorites(id: string, type: 'artists' | 'albums' | 'tracks') {
    switch (type) {
      case 'artists':
        this.favorites.artists = this.favorites.artists.filter(
          (favArtistId): boolean => favArtistId !== id,
        );
        break;
      case 'albums':
        this.favorites.albums = this.favorites.albums.filter(
          (favAlbumId): boolean => favAlbumId !== id,
        );
        break;
      case 'tracks':
        this.favorites.tracks = this.favorites.tracks.filter(
          (favTrackId): boolean => favTrackId !== id,
        );
        break;
    }
  }

  isFavoriteExist(id: string, type: 'artists' | 'albums' | 'tracks'): boolean {
    switch (type) {
      case 'artists':
        return this.artists.some((artist: Artist): boolean => artist.id === id);
      case 'albums':
        return this.albums.some((album: Album): boolean => album.id === id);
      case 'tracks':
        return this.tracks.some((track: Track): boolean => track.id === id);
    }
  }
}
