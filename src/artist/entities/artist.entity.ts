import { v4 as uuidv4 } from 'uuid';

interface IArtist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export class Artist implements IArtist {
  id: string;
  name: string;
  grammy: boolean;

  constructor(name: string, grammy: boolean) {
    this.id = uuidv4();
    this.name = name;
    this.grammy = grammy;
  }
}
