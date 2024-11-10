import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';

@Injectable()
export class DatabaseService {
  private readonly users: User[] = [];
  private readonly tracks: Track[] = [];
  private readonly artists: Artist[] = [];

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

  /** - `Update` block */
  updateUser(user: User): boolean {
    const index: number = this.users.findIndex(
      (usr: User): boolean => usr.id === user.id,
    );
    if (index === -1)
      throw new NotFoundException(`User with ID ${user.id} not found.`);
    this.users[index] = user;

    return true;
  }

  updateTrack(track: Track): boolean {
    const index: number = this.tracks.findIndex(
      (trk: Track): boolean => trk.id === track.id,
    );
    if (index === -1)
      throw new NotFoundException(`Track with ID ${track.id} not found.`);
    this.tracks[index] = track;

    return true;
  }

  updateArtist(artist: Artist): boolean {
    const index: number = this.artists.findIndex(
      (art: Artist): boolean => art.id === artist.id,
    );
    if (index === -1)
      throw new NotFoundException(`Artist with ID ${artist.id} not found.`);
    this.artists[index] = artist;

    return true;
  }

  /** - `Delete` block */
  deleteUser(id: string): boolean {
    const index: number = this.users.findIndex(
      (usr: User): boolean => usr.id === id,
    );
    if (index === -1)
      throw new NotFoundException(`User with ID ${id} not found.`);
    this.users.splice(index, 1);

    return true;
  }

  deleteTrack(id: string): boolean {
    const index: number = this.tracks.findIndex(
      (trk: Track): boolean => trk.id === id,
    );
    if (index === -1)
      throw new NotFoundException(`Track with ID ${id} not found.`);
    this.tracks.splice(index, 1);

    return true;
  }

  deleteArtist(id: string): boolean {
    const index: number = this.artists.findIndex(
      (art: Artist): boolean => art.id === id,
    );
    if (index === -1)
      throw new NotFoundException(`Artist with ID ${id} not found.`);

    this.tracks.forEach((track: Track): void => {
      if (track.artistId === id) track.artistId = null;
    });
    this.artists.splice(index, 1);

    return true;
  }
}
