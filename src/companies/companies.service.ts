import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { FindOneCompanyDto } from './dto/find-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const companies = await this.prisma.company.findMany({
      select: {
        id: true,
        name: true,
        cnpj: true,
        description: true,
        phone: true,
        website: true,
        user: { select: { id: true, name: true } },
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            category: { select: { name: true } },
          },
        },
        address: {
          select: {
            id: true,
            cep: true,
            street: true,
            number: true,
            neighborhood: true,
            city: true,
            state: true,
            complement: true,
          },
        },
        status: true,
      },
      where: { status: true },
    });

    return {
      event: 'findAllCompanies',
      data: companies,
    };
  }

  async findOne(findOneCompanyDto: FindOneCompanyDto) {
    const { id } = findOneCompanyDto;

    const company = await this.prisma.company.findUnique({
      select: {
        id: true,
        name: true,
        cnpj: true,
        description: true,
        phone: true,
        website: true,
        user: { select: { id: true, name: true } },
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            category: { select: { name: true } },
          },
        },
        address: {
          select: {
            id: true,
            cep: true,
            street: true,
            number: true,
            neighborhood: true,
            city: true,
            state: true,
            complement: true,
          },
        },
        status: true,
      },
      where: { id, status: true },
    });

    if (!company) {
      throw new WsException('Empresa não encontrada.');
    }

    return {
      event: 'findOneCompany',
      data: company,
    };
  }

  async create(createCompanyDto: CreateCompanyDto) {
    const { address, userId, ...rest } = createCompanyDto;

    await this.prisma.company.create({
      data: {
        ...rest,
        user: { connect: { id: userId } },
        address: { create: address },
      },
    });

    return {
      event: 'createCompany',
      data: 'Empresa criada com sucesso.',
    };
  }

  async update(updateCompanyDto: UpdateCompanyDto) {
    const { id, address, ...rest } = updateCompanyDto;

    if (updateCompanyDto?.address) {
      const { cep, city, neighborhood, number, state, street, complement } =
        address;

      await this.prisma.company.update({
        where: { id },
        data: {
          ...rest,
          address: {
            update: {
              cep,
              city,
              neighborhood,
              number,
              state,
              street,
              complement,
            },
          },
        },
      });
    } else {
      await this.prisma.company.update({
        where: { id },
        data: rest,
      });
    }

    return {
      event: 'updateCompany',
      data: 'Empresa atualizada com sucesso.',
    };
  }
}
