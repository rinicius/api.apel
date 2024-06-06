import { Injectable } from '@nestjs/common';
import { UpsertCategoryDto } from './dto/upsert-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { FindCategoryDto } from './dto/find-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: { status: true },
    });

    return {
      event: 'findAllCategories',
      data: categories,
    };
  }

  async findOne(findCategoryDto: FindCategoryDto) {
    const { name } = findCategoryDto;

    const category = await this.prisma.category.findUnique({
      where: { name, status: true },
      include: { product: true, _count: true },
    });

    if (!category) {
      throw new WsException('Categoria não encontrada.');
    }

    return {
      event: 'findOneCategory',
      data: category,
    };
  }

  async upsert(upsertCategoryDto: UpsertCategoryDto) {
    const { name, status } = upsertCategoryDto;

    const categoryValidate = await this.findOne({ name });

    if (categoryValidate) {
      throw new WsException('Categoria já existente.');
    }

    const category = await this.prisma.category.upsert({
      where: { name },
      update: { name, status },
      create: { name },
    });

    return {
      event: 'upsertCategory',
      data: category,
    };
  }
}
