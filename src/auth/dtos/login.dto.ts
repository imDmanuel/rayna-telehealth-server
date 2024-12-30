import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email is required' })
  email: string;

  @IsNotEmpty()
  password: string;
}
