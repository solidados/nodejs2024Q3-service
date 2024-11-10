interface IFavorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export class Favorites implements IFavorites {
  artists: Array<string> = [];
  albums: Array<string> = [];
  tracks: Array<string> = [];
}
