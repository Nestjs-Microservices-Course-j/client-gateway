import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ProductsController } from './products.controller';
import { envs, NATS_SERVICE } from 'src/config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports:[
    //*configuración de conexion al microservicio products ahora por NATS
    //* hacer la conexion con los microservicios en mas eficiente con NATS
    ClientsModule.register([
      { 
        //name: PRODUCT_SERVICE,  //*Conexion directa al microservicio
        name: NATS_SERVICE,  //*Conexion por nats
        transport: Transport.NATS, //Transport.TCP,
        options:{
          //host: envs.productsMicroserviceHost, //* configuracion para conexion directa al microservicio
          //port: envs.productsMicroservicePort,
          servers: envs.natsServers
        }
      },
    ]),
  ]
})
export class ProductsModule {}
