import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';

@Injectable()
export class DatabaseService {
  private readonly users: User[] = [];
  private readonly tracks: Track[] = [];
  private readonly artists: Artist[] = [];
  private readonly albums: Album[] = [];

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
      throw new NotFoundException({ message: `User with ID ${id} not found.` });
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
      });
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
      });

    this.tracks.forEach((track: Track): void => {
      if (track.artistId === id) track.artistId = null;
    });

    this.albums.forEach((album: Album): void => {
      if (album.artistId === id) album.artistId = null;
    });

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
      });

    this.tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });

    this.albums.splice(index, 1);

    return true;
  }
}
