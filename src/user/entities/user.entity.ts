/*
import { v4 as uuidv4 } from 'uuid';
import { Exclude, Transform } from 'class-transformer';

export class User {
  id: string;
  login: string;

  @Exclude()
  password: string;

  version: number;

  @Transform(({ value }: { value: number }) =>
    Math.floor(new Date(value).getTime() / 1000),
  )
  createdAt: number;
  @Transform(({ value }: { value: number }) =>
    Math.floor(new Date(value).getTime() / 1000),
  )
  updatedAt: number;

  constructor(login: string, password: string) {
    const timestamp: number = Math.floor(Date.now() / 1000);

    this.id = uuidv4();
    this.login = login;
    this.password = password;
    this.version = 1;
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }
}
*/
import { Exclude } from 'class-transformer';

export class User {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
