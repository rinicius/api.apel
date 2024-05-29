import { IsMongoId } from 'class-validator';

export class FindOneCompanyDto {
  @IsMongoId()
  id: string;
}
