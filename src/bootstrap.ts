import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Shared app bootstrap so `main.ts` and e2e tests run identical wiring.
 * `withSwagger` is off in tests: @nestjs/swagger's metadata explorer relies on
 * tsc-emitted decorator metadata that esbuild (vitest) doesn't reproduce, which
 * crashes the explorer. Swagger is still exercised by `npm run build` + live run.
 */
export async function createApp(withSwagger = true) {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  if (withSwagger) {
    const cfg = new DocumentBuilder()
      .setTitle('ragpilot-bff')
      .setDescription('NestJS BFF over the ragpilot RAG contract (Prisma + Swagger + JWT)')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();
    const doc = SwaggerModule.createDocument(app, cfg);
    SwaggerModule.setup('docs', app, doc);
  }
  return app;
}
