import * as process from 'node:process';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    const databaseUrl: string =
      process.env.DATABASE_URL || process.env.DATABASE_URL_LOCAL;
    await this.$connect({
      dataSourceSwitch: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }
}
