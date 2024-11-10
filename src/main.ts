// import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

// const PORT = Number(process.env.PORT) || 4001;

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 4001);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () =>
    console.log(
      `\x1b[96mServer is running on PORT: \x1b[7m ${port} \x1b[27m\x1b[0m`,
    ),
  );
}
bootstrap().catch((err) => console.error(err.message));
