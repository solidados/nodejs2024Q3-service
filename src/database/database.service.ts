import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class DatabaseService {
  private readonly users: User[] = [];
  private readonly tracks: Track[] = [];

  addUser(user: User) {
    this.users.push(user);
  }

  addTrack(track: Track) {
    this.tracks.push(track);
  }

  getUsers(): User[] {
    return this.users;
  }

  getTracks(): Track[] {
    return this.tracks;
  }

  getUserById(id: string): User {
    return this.users.find((usr: User): boolean => usr.id === id);
  }

  getTrackById(id: string): Track {
    return this.tracks.find((trk: Track): boolean => trk.id === id);
  }

  updateUser(user: User) {
    const index: number = this.users.findIndex(
      (usr: User): boolean => usr.id === user.id,
    );
    this.users[index] = user;
  }

  updateTrack(track: Track) {
    const index: number = this.tracks.findIndex(
      (trk: Track): boolean => trk.id === track.id,
    );
    this.tracks[index] = track;
  }

  deleteUser(id: string) {
    const index: number = this.users.findIndex(
      (usr: User): boolean => usr.id === id,
    );
    this.users.splice(index, 1);
  }

  deleteTrack(id: string) {
    const index: number = this.tracks.findIndex(
      (trk: Track): boolean => trk.id === id,
    );
    this.tracks.splice(index, 1);
  }
}
