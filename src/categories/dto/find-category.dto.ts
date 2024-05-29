import { IsNotEmpty, IsString } from 'class-validator';

export class FindCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
