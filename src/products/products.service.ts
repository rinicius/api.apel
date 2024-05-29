import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompaniesService } from 'src/companies/companies.service';
import { FindProductDto } from './dto/find-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companiesService: CompaniesService,
  ) {}

  async findAll() {
    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        address: {
          select: {
            id: true,
            cep: true,
            city: true,
            number: true,
            state: true,
            street: true,
            neighborhood: true,
          },
        },
        category: { select: { name: true } },
        user: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
      },
      where: { status: true },
    });

    return {
      event: 'findAllProducts',
      data: products,
    };
  }

  async findOne(findProductDto: FindProductDto) {
    const { id } = findProductDto;

    const product = await this.prisma.product.findUnique({
      select: {
        id: true,
        name: true,
        description: true,
        address: {
          select: {
            id: true,
            cep: true,
            city: true,
            number: true,
            state: true,
            street: true,
            neighborhood: true,
          },
        },
        category: { select: { name: true } },
        user: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
      },
      where: { id, status: true },
    });

    return {
      event: 'findOneProducts',
      data: product,
    };
  }

  async create(createProductDto: CreateProductDto) {
    if (createProductDto?.companyId) {
      const { name, description, categoryId, userId, companyId } =
        createProductDto;

      const company = await this.companiesService.findOne({ id: companyId });

      await this.prisma.product.create({
        data: {
          name,
          description,
          categoryId,
          userId,
          companyId,
          addressId: company.data.address.id,
        },
      });
    } else {
      const { name, description, categoryId, userId, address } =
        createProductDto;

      const { cep, city, neighborhood, number, state, street, complement } =
        address;

      await this.prisma.$transaction(async (tx) => {
        const address = await tx.address.create({
          data: { cep, city, neighborhood, number, state, street, complement },
        });

        await tx.product.create({
          data: {
            name,
            description,
            categoryId,
            userId,
            addressId: address.id,
          },
        });
      });
    }

    return {
      event: 'createProduct',
      data: 'Produto criado com sucesso.',
    };
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id } = updateProductDto;
    await this.prisma.product.update({
      data: updateProductDto,
      where: { id, status: true },
    });
  }
}
