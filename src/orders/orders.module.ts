import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs, NATS_SERVICE } from 'src/config';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports:[
    ClientsModule.register([
      {
        //name: ORDER_SERVICE,
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          // host: envs.ordersMicroserviceHost,
          // port: envs.ordersMicroservicePort
          servers: envs.natsServers
        }
      }
    ]),
  ]
})
export class OrdersModule {}
