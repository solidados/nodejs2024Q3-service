import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashService {
  salt: number;

  constructor(private readonly configService: ConfigService) {
    this.salt = Number(this.configService.get<number>('CRYPT_SALT', 10));
  }

  async getHash(data: string): Promise<string> {
    return await bcrypt.hash(data, this.salt);
  }

  async comparePasswords(
    data: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(data, hashedPassword);
  }
}
