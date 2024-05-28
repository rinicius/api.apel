import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDate()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  gender: string;

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
