import { Injectable, ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const messages: string[] = [];

      errors.forEach((error) =>
        Object.values(error.constraints).forEach((item) => messages.push(item)),
      );

      throw new WsException({
        message: 'Validation failed.',
        errors: messages,
      });
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
