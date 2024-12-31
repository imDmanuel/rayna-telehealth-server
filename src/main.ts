import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { CustomValidationPipe } from './lib/custom-validation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });
  app.useGlobalPipes(
    new CustomValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
  );
  app.setGlobalPrefix('api');
  const devOrigin =
    process.env.NODE_ENV === 'development'
      ? ['http://localhost:3000', 'http://localhost:3001']
      : [];
  app.enableCors({
    origin: [...devOrigin, 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'],
    credentials: true,
  });
  app.use(cookieParser());
  const port = process.env.PORT ?? 3000;
  await app.listen(port ?? 3000);
  console.log(`Server listening on port ${port}`);
}
bootstrap();
