import { Injectable } from '@nestjs/common';
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
  getUserById(id: string): User {
    return this.users.find((usr: User): boolean => usr.id === id);
  }

  getTrackById(id: string): Track {
    return this.tracks.find((trk: Track): boolean => trk.id === id);
  }

  getArtistById(id: string): Artist {
    return this.artists.find((art: Artist): boolean => art.id === id);
  }

  /** - `Update` block */
  updateUser(user: User): void {
    const index: number = this.users.findIndex(
      (usr: User): boolean => usr.id === user.id,
    );
    this.users[index] = user;
  }

  updateTrack(track: Track): void {
    const index: number = this.tracks.findIndex(
      (trk: Track): boolean => trk.id === track.id,
    );
    this.tracks[index] = track;
  }

  updateArtist(artist: Artist): void {
    const index: number = this.artists.findIndex(
      (art: Artist): boolean => art.id === artist.id,
    );
    this.artists[index] = artist;
  }

  /** - `Delete` block */
  deleteUser(id: string): void {
    const index: number = this.users.findIndex(
      (usr: User): boolean => usr.id === id,
    );
    this.users.splice(index, 1);
  }

  deleteTrack(id: string): void {
    const index: number = this.tracks.findIndex(
      (trk: Track): boolean => trk.id === id,
    );
    this.tracks.splice(index, 1);
  }

  deleteArtist(id: string): void {
    const index: number = this.artists.findIndex(
      (art: Artist): boolean => art.id === id,
    );
    this.tracks.forEach((track: Track): void => {
      if (track.artistId === id) track.artistId = null;
    });
    this.artists.splice(index, 1);
  }
}
