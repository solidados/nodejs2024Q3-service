import { v4 as uuidv4 } from 'uuid';

interface IAlbum {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

export class Album implements IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  // TODO: test if default `null` is Ok?
  constructor(name: string, year: number, artistId: string | null = null) {
    this.id = uuidv4();
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }
}
