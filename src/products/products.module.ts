import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';

import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports:[ 
    //*ahora en este modulo se hace la configuracion para el transport y solo se inyecta
    NatsModule
   ]
})
export class ProductsModule {}
