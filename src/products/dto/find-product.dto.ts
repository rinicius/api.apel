import { IsMongoId } from 'class-validator';

export class FindProductDto {
  @IsMongoId()
  id: string;
}
