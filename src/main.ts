import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';


async function bootstrap() {
  const logger = new Logger('Main-Mateway');
  
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  //* configurando los filtros de exceciones globales de nuestra clase personalizada
  //* con esto todas las peticiones seran primero filtradas para verificar si no tiene error
  //* y detectara todas las exceptiones donde se utilice el RpcException
  app.useGlobalFilters( new RpcCustomExceptionFilter())
  
  await app.listen(envs.port);
  logger.log(`Gateway running on port ${envs.port}`)
}
bootstrap();
