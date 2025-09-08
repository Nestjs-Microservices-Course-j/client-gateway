import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    
    //*se agrega para trabajar con microservicios
    @IsNumber()
    @IsPositive()
    id: number
}
