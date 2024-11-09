import { v4 as uuidv4 } from 'uuid';

interface IUser {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export class User implements IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(login: string, password: string) {
    const timestamp: number = Date.now();

    this.id = uuidv4();
    this.login = login;
    this.password = password;
    this.version = 1;
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }

  updateFields(fields: Partial<Omit<IUser, 'id' | 'createdAt'>>) {
    if (fields.login) this.login = fields.login;
    if (fields.password) this.password = fields.password;
    this.version += 0.1;
    this.updatedAt = Date.now();
  }
}
