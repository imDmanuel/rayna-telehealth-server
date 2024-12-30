import { IsEmail } from 'class-validator';

export class ResendSignupOtp {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
