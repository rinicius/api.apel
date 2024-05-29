import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesGateway } from './companies.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CompaniesGateway, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
