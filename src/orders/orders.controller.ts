import { Controller, Get, Post, Body,  Param, Inject, Query, ParseUUIDPipe, ParseEnumPipe, UnprocessableEntityException, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

import { ChangeStatusDto, CreateOrderDto, OrderPaginationDto } from './dto';
import { PaginationDto } from 'src/common';
import { OrderStatus, OrderStatusList } from './enum/order.enum';
import { NATS_SERVICE } from 'src/config';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly natsClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.natsClient.send('createOrder', createOrderDto).pipe(
          catchError(err => {          
            throw new RpcException(err)
          })
        );
    
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.natsClient.send('findOneOrder', { id }).pipe(
          catchError(err => {
            throw new RpcException(err)
          })
        );
  }

  @Get(':status')
  findByStatus(
    @Param('status', new ParseEnumPipe(OrderStatus, {
      errorHttpStatusCode: 422,
      exceptionFactory: () => new UnprocessableEntityException(`Possible status values are ${ OrderStatusList }`),
    })) 
    status: OrderStatus,
    @Query() paginationDto: PaginationDto
  ) {
    return this.natsClient.send('findAllOrders', {status, ...paginationDto} );
  }

  @Get()
  async findAll(
    @Query() paginationDto: OrderPaginationDto
  ) {
    try {
      const orders = await firstValueFrom(
         this.natsClient.send('findAllOrders', paginationDto )
      );
      return orders;
    } catch (error) {
       throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeStatusDto : ChangeStatusDto
  ) {
    return this.natsClient.send('changeOrderStatus', { id, ...changeStatusDto }).pipe(
          catchError(err => {
            throw new RpcException(err)
          })
        );
  }
}
