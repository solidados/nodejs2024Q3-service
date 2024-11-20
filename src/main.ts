import { dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { load } from 'js-yaml';

import { AppModule } from './app.module';

async function loadSwaggerDocument(
  filePath: string,
): Promise<OpenAPIObject | null> {
  try {
    const fileContent: string = await readFile(filePath, 'utf-8');
    return load(fileContent, { json: true }) as OpenAPIObject;
  } catch (error) {
    console.error(`Failed to load Swagger document: ${error.message}`);
    return null;
  }
}

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT', 4001);

  const swaggerPath: string = resolve(dirname(__dirname), 'doc', 'api.yaml');
  const swaggerDocument: OpenAPIObject = await loadSwaggerDocument(swaggerPath);

  if (swaggerDocument) SwaggerModule.setup('doc', app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () =>
    console.log(
      `\n> \x1b[96mServer is running on PORT: \x1b[7m ${port} \x1b[27m\x1b[0m`,
      `\n> \x1b[35mFor OpenAPI docs, visit:\x1b[0m http://localhost:${port}/doc`,
    ),
  );
}
bootstrap().catch((err) => console.error(err.message));
