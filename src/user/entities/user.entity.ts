import { v4 as uuidv4 } from 'uuid';
import { Exclude, Transform } from 'class-transformer';

export class User {
  id: string;
  login: string;

  @Exclude()
  password: string;

  version: number;

  @Transform(({ value }: { value: string | number }): number =>
    typeof value === 'string' ? new Date(value).getTime() : value,
  )
  createdAt: number;
  @Transform(({ value }: { value: string | number }): number =>
    typeof value === 'string' ? new Date(value).getTime() : value,
  )
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
}
