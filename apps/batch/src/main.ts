import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();
}

bootstrap().catch((err) => {
  console.error('Batch server failed to start:', err);
  process.exit(1);
});
