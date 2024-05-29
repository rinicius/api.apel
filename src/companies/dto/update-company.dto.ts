import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './create-company.dto';
import { Type } from 'class-transformer';

export class UpdateCompanyDto {
  @IsMongoId()
  id: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  phone?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
