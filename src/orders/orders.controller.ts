import { Controller, Get, Post, Body,  Param, Inject, ParseIntPipe, Query, ParseUUIDPipe, ParseEnumPipe, UnprocessableEntityException, Patch } from '@nestjs/common';


import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ChangeStatusDto, CreateOrderDto, OrderPaginationDto } from './dto';
import { PaginationDto } from 'src/common';
import { OrderStatus, OrderStatusList } from './enum/order.enum';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly ordersClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto).pipe(
          catchError(err => {          
            throw new RpcException(err)
          })
        );
    
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder', { id }).pipe(
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
    return this.ordersClient.send('findAllOrders', {status, ...paginationDto} );
  }

  @Get()
  findAll(
    @Query() paginationDto: OrderPaginationDto
  ) {
    return this.ordersClient.send('findAllOrders', paginationDto );
  }

  @Patch(':id')
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeStatusDto : ChangeStatusDto
  ) {
    return this.ordersClient.send('changeOrderStatus', { id, ...changeStatusDto }).pipe(
          catchError(err => {
            throw new RpcException(err)
          })
        );
  }
}
