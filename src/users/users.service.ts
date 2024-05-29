import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { FindOneUserDto } from './dto/find-user.dto';
import { EncryptService } from 'src/encrypt/encrypt.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encrypt: EncryptService,
  ) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        company: {
          select: {
            id: true,
            cnpj: true,
            name: true,
            description: true,
            status: true,
          },
        },
      },
      where: { status: true },
    });

    return {
      event: 'findAllUsers',
      data: users,
    };
  }

  async findOne(findOneUserDto: FindOneUserDto) {
    const { id } = findOneUserDto;

    const user = await this.prisma.user.findUnique({
      where: { id, status: true },
    });

    if (!user) {
      throw new WsException('Usuário não encontrado.');
    }

    return {
      event: 'findOneUser',
      data: user,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const { birthDate, password, ...rest } = createUserDto;

    const passwordHash = await this.encrypt.hashGenerate(password);

    await this.prisma.user.create({
      data: { ...rest, birth_date: birthDate, password: passwordHash },
    });

    return {
      event: 'createUser',
      data: 'Usuário criado com sucesso.',
    };
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...rest } = updateUserDto;

    if (updateUserDto?.password) {
      const passwordHash = await this.encrypt.hashGenerate(
        updateUserDto.password,
      );

      await this.prisma.user.update({
        where: { id },
        data: { ...rest, password: passwordHash },
      });
    } else {
      await this.prisma.user.update({
        where: { id },
        data: { ...rest },
      });
    }

    return {
      event: 'updateUser',
      data: 'Usuário atualizado com sucesso.',
    };
  }
}
