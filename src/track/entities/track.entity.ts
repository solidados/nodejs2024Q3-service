import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';

export class Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ) {
    if (duration <= 0) {
      throw new BadRequestException({
        status: 400,
        message: 'Track duration must be a positive number',
        code: 'BAD_REQUEST',
      });
    }

    this.id = uuidv4();
    this.name = name;
    this.artistId = artistId;
    this.albumId = albumId;
    this.duration = duration;
  }
}
