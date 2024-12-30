import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignupDto {
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address',
    },
  )
  email: string;

  @IsString({ message: 'Please provide a valid password' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString({ message: 'Please provide a valid first name' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString({ message: 'Please provide a valid last name' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;
}
