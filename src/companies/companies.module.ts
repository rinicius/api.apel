import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesGateway } from './companies.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [CompaniesGateway, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
