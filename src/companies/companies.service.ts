import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { FindOneCompanyDto } from './dto/find-company.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async compareCnpj(cnpj: string, companyDto: CreateCompanyDto) {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`),
    );

    delete companyDto.phone;
    delete companyDto.userId;
    delete companyDto.website;
    delete companyDto.description;

    const dataDto = plainToInstance(CreateCompanyDto, {
      name: data.razao_social,
      cnpj: data.cnpj,
      address: {
        street: data.logradouro,
        number: data.numero,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.municipio,
        state: data.uf,
        cep: data.cep,
      },
    });

    const companyKeys = Object.keys(companyDto);
    const dataKeys = Object.keys(dataDto);
    const addressKeys = Object.keys(dataDto.address);

    for (const key of dataKeys) {
      if (key === 'address') {
        for (const addressKey of addressKeys) {
          if (companyDto[key][addressKey] !== dataDto[key][addressKey]) {
            return false;
          }
        }
      } else if (
        (key !== 'address' && !companyKeys.includes(key)) ||
        companyDto[key] !== dataDto[key]
      ) {
        return false;
      }
    }
    return true;
  }

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
    const { address, userId, cnpj, ...rest } = createCompanyDto;

    const check = await this.compareCnpj(cnpj, createCompanyDto);

    if (!check) {
      throw new WsException('Erro na validação dos dados do CNPJ.');
    }

    await this.prisma.company
      .create({
        data: {
          ...rest,
          cnpj,
          user: { connect: { id: userId } },
          address: { create: address },
        },
      })
      .catch(() => {
        throw new WsException('Erro na criação de um novo objeto no banco');
      });

    return {
      event: 'createCompany',
      data: 'Empresa cadastrada com sucesso.',
    };
  }

  async update(updateCompanyDto: UpdateCompanyDto) {
    const { id, address, ...rest } = updateCompanyDto;

    if (updateCompanyDto?.address) {
      const { cep, city, neighborhood, number, state, street, complement } =
        address;

      await this.prisma.company
        .update({
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
        })
        .catch(() => {
          throw new WsException('Erro na atualização do objeto no banco');
        });
    } else {
      await this.prisma.company
        .update({
          where: { id },
          data: rest,
        })
        .catch(() => {
          throw new WsException('Erro na atualização do objeto no banco');
        });
    }

    return {
      event: 'updateCompany',
      data: 'Empresa atualizada com sucesso.',
    };
  }
}
