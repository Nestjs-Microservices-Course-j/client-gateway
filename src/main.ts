import { NestFactory } from '@nestjs/core';
import { ValidationPipe,  } from '@nestjs/common';

import { AppModule } from './app.module';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  //* configurando los fitltros de exceciones globales de nuestra clase personalizada
  //* con esto todas las peticiones seran primero filtradas para verificar si no tiene error
  //* y detectara todas las exceptiones donde se utilice el RpcException
  app.useGlobalFilters( new RpcCustomExceptionFilter())
  
  await app.listen(envs.port);
}
bootstrap();
