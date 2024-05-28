import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsMongoId()
  id: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  department?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  biography?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  website?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  linkedin?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  twitter?: string;
}
