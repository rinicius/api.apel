import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FindOneCompanyDto } from './dto/find-company.dto';

@WebSocketGateway()
export class CompaniesGateway {
  constructor(private readonly companiesService: CompaniesService) {}

  @SubscribeMessage('findAllCompanies')
  findAll() {
    return this.companiesService.findAll();
  }

  @SubscribeMessage('findOneCompany')
  findOne(@MessageBody() findOneCompanyDto: FindOneCompanyDto) {
    return this.companiesService.findOne(findOneCompanyDto);
  }

  @SubscribeMessage('createCompany')
  create(@MessageBody() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @SubscribeMessage('updateCompany')
  update(@MessageBody() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(updateCompanyDto);
  }
}
