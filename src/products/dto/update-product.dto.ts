import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsMongoId()
  id: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsMongoId()
  @IsOptional()
  categoryId?: string;
}
