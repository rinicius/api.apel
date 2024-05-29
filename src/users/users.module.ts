import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersGateway } from './users.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EncryptModule } from 'src/encrypt/encrypt.module';

@Module({
  imports: [PrismaModule, EncryptModule],
  providers: [UsersGateway, UsersService],
})
export class UsersModule {}
