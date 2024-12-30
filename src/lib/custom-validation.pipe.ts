import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError, ValidatorOptions, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(private readonly options?: ValidatorOptions) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, this.options);

    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]) {
    const messages = errors.flatMap((err) =>
      Object.values(err.constraints || {}),
    );
    return {
      reason: 'validation-error',
      message: messages,
    };
  }
}
