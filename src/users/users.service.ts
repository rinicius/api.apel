import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { FindOneUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();

    return {
      event: 'findAllUsers',
      data: users,
    };
  }

  async findOne(findOneUserDto: FindOneUserDto) {
    const { id } = findOneUserDto;

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new WsException('Usuário não encontrado.');
    }

    return {
      event: 'findOneUser',
      data: user,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const { birthDate, ...rest } = createUserDto;

    await this.prisma.user.create({ data: { birth_date: birthDate, ...rest } });

    return {
      event: 'createUser',
      data: 'Usuário criado com sucesso.',
    };
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...rest } = updateUserDto;

    await this.prisma.user.update({
      where: { id },
      data: { ...rest },
    });
  }

  async remove(id: string) {
    this.prisma.user.update({ where: { id }, data: { status: false } });
  }
}
