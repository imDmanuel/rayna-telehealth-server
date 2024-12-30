import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { HashingService } from 'src/hashing/hashing.service';
import { authTable } from 'src/drizzle/schemas/auth.schema';
import { usersTable } from 'src/drizzle/schemas/user.schema';
import { LoggerService } from 'src/logger/logger.service';
import { LoginDto } from './dtos/login.dto';
import { AuthMethod } from './enums/auth-method.enum';
import { ConfigService } from '@nestjs/config';
import { FRONTEND_URL, JWT_SECRET, JWT_TTL } from 'src/lib/constants';
import { JwtPayload, OauthUser } from './auth.interfaces';
import { ErrorResponse } from 'src/lib/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { MailJobsService } from 'src/email/mail-jobs.service';
import { OtpService } from 'src/otp/otp.service';
import { OtpFor } from './enums/otp-for.enum';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { eq } from 'drizzle-orm';
import { ConfirmOtpDto } from './dtos/confirm-otp.dto';
import { ResendSignupOtp } from './dtos/resend-signup-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private drizzleService: DrizzleService,
    private hashingService: HashingService,
    private logger: LoggerService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailJobsService: MailJobsService,
    private otpService: OtpService,
  ) {}

  async signup(dto: SignupDto) {
    // Check if user already exists
    const userDetails = await this.drizzleService.db.query.authTable.findFirst({
      where: (users, { eq }) => eq(users.email, dto.email),
    });

    if (userDetails) {
      throw new InternalServerErrorException({
        reason: 'user-exists',
        message: 'The email is already registered on this platform',
      });
    }

    // Hash the password for database storage
    const hashedPassword = await this.hashingService.hash(dto.password);

    // Store the credentials in the database
    try {
      const otpDetails = await this.drizzleService.db.transaction(
        async (tx) => {
          const uuid = crypto.randomUUID();
          await tx.insert(usersTable).values({
            id: uuid,
            firstName: dto.firstName,
            lastName: dto.lastName,
          });
          await tx.insert(authTable).values({
            email: dto.email,
            password: hashedPassword,
            userId: uuid,
          });

          return this.otpService.generateAndSaveOtp(dto.email, OtpFor.SIGNUP);
        },
      );

      await this.mailJobsService.sendSignupOtp(dto.email, otpDetails);

      const response = {
        data: {},
        message: 'User profile successfully created',
      };
      return response;
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e.message);
        const errorResponse: ErrorResponse = {
          reason: 'generic-failure',
          message: 'Something went wrong while creating user profile',
        };
        throw new InternalServerErrorException(errorResponse);
      }
    }
  }

  async login(dto: LoginDto) {
    const user = await this.drizzleService.db.query.authTable.findFirst({
      where: (auth, { eq }) => {
        return eq(auth.email, dto.email);
      },
    });

    if (!user) {
      throw new InternalServerErrorException({
        reason: 'not-found',
        message: 'The user with the email address was not found',
      } as ErrorResponse);
    }

    if (user.authMethod !== AuthMethod.EMAIL) {
      throw new InternalServerErrorException({
        reason: 'invalid-auth-method',
        message: 'Please use the login method',
      } as ErrorResponse);
    }

    const passwordIsValid = await this.hashingService.compare(
      dto.password,
      user.password,
    );
    if (!passwordIsValid) {
      throw new InternalServerErrorException({
        reason: 'wrong-password',
        message: 'The password is not correct',
      } as ErrorResponse);
    }

    if (!user.emailVerified) {
      throw new ForbiddenException({
        reason: 'email-unverified',
        message: 'Your email has not been verified',
      } as ErrorResponse);
    }

    const payload: JwtPayload = { email: user.email, sub: user.userId };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(JWT_TTL),
      secret: this.configService.get(JWT_SECRET),
    });

    const response = {
      message: 'Login successful',
      data: {},
      accessToken,
    };

    return response;
  }

  async googleLogin(userData: OauthUser) {
    try {
      const response = await this.login({
        email: userData.email,
        password: 'DEFAULT_PASSWORD',
      });

      return {
        accessToken: response.accessToken,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        reason: 'login-failed',
        message: 'Google login failed',
      } as ErrorResponse);
    }
  }

  async confirmSignupOtp(dto: ConfirmOtpDto) {
    await this.otpService.retriveAndVerifyOtp(
      dto.email,
      OtpFor.SIGNUP,
      dto.otp,
    );

    const authDetails = (
      await this.drizzleService.db
        .update(authTable)
        .set({
          emailVerified: true,
        })
        .where(eq(authTable.email, dto.email))
        .returning()
    ).pop();

    await this.otpService.removeOtp(dto.email);

    return {
      message: 'Email has been verified successfully',
      data: {
        userId: authDetails.userId,
      },
    };
  }

  async resendSignupOtp(dto: ResendSignupOtp) {
    const authDetails = (
      await this.drizzleService.db
        .select()
        .from(authTable)
        .where(eq(authTable.email, dto.email))
    ).pop();
    if (authDetails.emailVerified) {
      throw new InternalServerErrorException({
        reason: 'email-verified',
        message: 'Your email adress has already been verified, please login.',
      } as ErrorResponse);
    }
    const otpDetails = await this.otpService.generateAndSaveOtp(
      dto.email,
      OtpFor.SIGNUP,
    );
    console.log(otpDetails);
    await this.mailJobsService.sendSignupOtp(dto.email, otpDetails);

    return {
      message: 'OTP resent',
      data: {
        userId: authDetails.userId,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const authDetails = await this.drizzleService.db.query.authTable.findFirst({
      where: (auth, { eq }) => {
        return eq(auth.email, dto.email);
      },
      with: {
        user: true,
      },
    });

    if (!authDetails) {
      throw new NotFoundException({
        reason: 'not-found',
        message: 'This email does not belong to any account',
      } satisfies ErrorResponse);
    }

    const { otp, expiryTime } = await this.otpService.generateAndSaveOtp(
      authDetails.email,
      OtpFor.FORGOT_PASSWORD,
    );

    await this.mailJobsService.sendForgotPasswordOtp(dto.email, {
      otp,
      expiryTime,
      firstName: authDetails.user.firstName,
    });

    return {
      message: 'An OTP has been sent to your email address',
      data: {},
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    await this.otpService.retriveAndVerifyOtp(
      dto.email,
      OtpFor.FORGOT_PASSWORD,
      dto.otp,
    );

    const hashedPassword = await this.hashingService.hash(dto.password);

    // if the otp is valid proceed to reset the password
    await this.drizzleService.db
      .update(authTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(authTable.email, dto.email));

    await this.otpService.removeOtp(dto.email);

    return {
      data: {},
      message: 'Password reset was successful',
    };
  }
}
