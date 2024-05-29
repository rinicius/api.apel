import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesGateway } from './categories.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CategoriesGateway, CategoriesService],
})
export class CategoriesModule {}
