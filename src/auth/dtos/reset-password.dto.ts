import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Please provide a valid OTP' })
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;

  @IsString()
  @IsNotEmpty({ message: 'Please provide the user email to reset password' })
  email: string;

  @IsString({ message: 'Please provide a valid new password' })
  @IsNotEmpty({ message: 'Please provide your new password' })
  password: string;
}
