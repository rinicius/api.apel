import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpsertCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
