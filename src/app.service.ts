import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <div>
        <h1>Music Attic</h1>
        <h3>Use & Enjoy</h3>
      </div>
    `;
  }
}
