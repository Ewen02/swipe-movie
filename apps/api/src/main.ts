import '../instrument'; // Must be first import
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SentryExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable gzip compression for all responses
  app.use(compression());

  // Apply global exception filters
  // SentryExceptionFilter catches all exceptions and sends to Sentry
  // HttpExceptionFilter provides secure error responses
  app.useGlobalFilters(
    new SentryExceptionFilter(),
    new HttpExceptionFilter(),
  );

  // Configure Helmet avec des options adaptées pour les APIs
  app.use(
    helmet({
      contentSecurityPolicy: false, // Désactivé car c'est une API, pas un site web
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: 'deny' }, // Prevent clickjacking
      noSniff: true, // Prevent MIME type sniffing
      xssFilter: true, // Enable XSS filter
    }),
  );

  app.enableCors({ origin: process.env.WEB_ORIGIN, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Swipe Movie API')
    .setDescription('Endpoints REST du backend')
    .setVersion('1.0.0')
    .addBearerAuth() // Authorization: Bearer <token>
    .addServer(process.env.API_ORIGIN ?? 'http://localhost:3001', 'Local API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3001);
  Logger.log(
    `🚀 Application is running on: ${process.env.API_ORIGIN}`,
    'Bootstrap',
  );
  Logger.log(
    `📖 Swagger is running on: ${process.env.API_ORIGIN}/docs`,
    'Bootstrap',
  );
}

void bootstrap();
