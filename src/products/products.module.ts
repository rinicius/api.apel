import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsGateway } from './products.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  imports: [PrismaModule, CompaniesModule],
  providers: [ProductsGateway, ProductsService],
})
export class ProductsModule {}
