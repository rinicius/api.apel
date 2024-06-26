import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UseFilters, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes/dtovalidate.pipe';
import { WsExceptionFilter } from 'src/pipes/validation.pipe';

@UsePipes(new ValidationPipe())
@UseFilters(WsExceptionFilter)
@WebSocketGateway()
export class ProductsGateway {
  constructor(private readonly productsService: ProductsService) {}

  @SubscribeMessage('findAllProducts')
  findAll() {
    return this.productsService.findAll();
  }

  @SubscribeMessage('findOneProduct')
  findOne(@MessageBody() findProductDto: FindProductDto) {
    return this.productsService.findOne(findProductDto);
  }

  @SubscribeMessage('createProduct')
  create(@MessageBody() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @SubscribeMessage('updateProduct')
  update(@MessageBody() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }
}
