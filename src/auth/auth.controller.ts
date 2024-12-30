import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ActiveUser } from './active-user.decorator';
import { JwtPayload, OauthRequestWithUser, OauthUser } from './auth.interfaces';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { FRONTEND_URL } from 'src/lib/constants';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ResendSignupOtp } from './dtos/resend-signup-otp.dto';
import { ConfirmOtpDto } from './dtos/confirm-otp.dto';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: OauthRequestWithUser) {
    const frontendUrl = this.configService.get(FRONTEND_URL);
    const { accessToken } = await this.authService.googleLogin(req.user);

    req.res.redirect(
      `${frontendUrl}/oauth-success-redirect?accessToken=${accessToken}`,
    );
  }

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() dto: LoginDto) {
    const response = this.authService.login(dto);
    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   partitioned: true,
    //   secure: true,
    // });
    return response;
  }

  @Post('confirm-signup-otp')
  confirmSignupOtp(@Body() dto: ConfirmOtpDto) {
    return this.authService.confirmSignupOtp(dto);
  }

  @Post('resend-signup-otp')
  resendSignupOtp(@Body() dto: ResendSignupOtp) {
    return this.authService.resendSignupOtp(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
