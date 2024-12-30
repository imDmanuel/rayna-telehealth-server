import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class ConfirmOtpDto {
  @IsString()
  otp: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;
}
