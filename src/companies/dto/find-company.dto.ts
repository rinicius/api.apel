import { IsString, IsNotEmpty } from 'class-validator';

export class FindOneCompanyDto {
  @IsString()
  @IsNotEmpty()
  cnpj: string;
}
