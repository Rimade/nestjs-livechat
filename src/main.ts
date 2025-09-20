import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Настройка CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Обслуживание статических файлов
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const prismaService = app.get(PrismaService);
  // Настройка graceful shutdown для Prisma
  process.on('beforeExit', () => {
    void prismaService.$disconnect();
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
  console.log(`💬 Чат доступен на http://localhost:${port}`);
}
bootstrap().catch((error) => {
  console.error('Ошибка при запуске сервера:', error);
  process.exit(1);
});
