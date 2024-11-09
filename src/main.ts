import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = Number(process.env.PORT) || 4001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () =>
    console.log(
      `\x1b[96mServer is running on PORT: \x1b[7m ${PORT} \x1b[27m\x1b[0m`,
    ),
  );
}
bootstrap().catch((err) => console.error(err.message));
