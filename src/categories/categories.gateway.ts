import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { CategoriesService } from './categories.service';
import { UpsertCategoryDto } from './dto/upsert-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';

@WebSocketGateway()
export class CategoriesGateway {
  constructor(private readonly categoriesService: CategoriesService) {}

  @SubscribeMessage('findAllCategories')
  findAll() {
    return this.categoriesService.findAll();
  }

  @SubscribeMessage('findOneCategory')
  findOne(@MessageBody() findCategoryDto: FindCategoryDto) {
    return this.categoriesService.findOne(findCategoryDto);
  }

  @SubscribeMessage('upsertCategory')
  update(@MessageBody() upsertCategoryDto: UpsertCategoryDto) {
    return this.categoriesService.upsert(upsertCategoryDto);
  }
}
