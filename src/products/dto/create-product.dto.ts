import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from 'src/companies/dto/create-company.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsMongoId()
  categoryId: string;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  @IsOptional()
  companyId?: string;

  @ValidateIf((fields) => !fields?.companyId)
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
