import { IsMongoId } from 'class-validator';

export class FindOneUserDto {
  @IsMongoId()
  id: string;
}
