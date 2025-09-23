import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, first, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE, PRODUCT_SERVICE } from 'src/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard.ts/auth.guard';

@Controller('products')
export class ProductsController {

  constructor(
    //*injectando el inyection token del microservicio products
    @Inject(NATS_SERVICE)
    private readonly natsClient: ClientProxy
  ) {}

  @Post()
  async create( 
    @Body() createProductDto: CreateProductDto
  ){
    try {
      const product = await firstValueFrom(
        this.natsClient.send({ cmd: 'create' }, createProductDto)
      );

      return product;
      
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query() paginationDto : PaginationDto
  ) {
    //* conectando función con product microcorservice
    //* el primer parametro es el MessagePattern que se establecio en el controlador del MS
    //* el segundo es el payload
    //return this.productsClient.send({ cmd: 'find_all' }, paginationDto); 

    //*otra manera de acerlo
    return this.natsClient.send({ cmd: 'find_all' }, paginationDto).pipe(
      catchError(err => {throw new RpcException(err)})
    ); 
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number ) {
    try {
      const product = await firstValueFrom(
        this.natsClient.send({ cmd: 'find_one' }, { id })
      );

      return product;
      
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ){

    return this.natsClient.send({ cmd: 'update' }, {id, ...updateProductDto}).pipe(
      catchError(err => {throw new RpcException(err)})
    ); 
    
  }

  @Delete(':id')
  async delete(@Param('id') id: string){

    return this.natsClient.send({ cmd: 'delete' }, { id }).pipe(
      catchError(err => {throw new RpcException(err)})
    );    
  }
}
