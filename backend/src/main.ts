import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import { validateEnv } from './config/env.config';

config();

const env = validateEnv(process.env);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: env.FRONTEND_URL,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Kolok API')
    .setDescription('API pour gerer les rooms et leurs outils')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.PORT);
}

bootstrap();
