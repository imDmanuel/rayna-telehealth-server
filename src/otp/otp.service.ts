// otp.service.ts
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { OtpFor } from 'src/auth/enums/otp-for.enum';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { authTable } from 'src/drizzle/schemas/auth.schema';
import { usersTable } from 'src/drizzle/schemas/user.schema';
import { ErrorResponse } from 'src/lib/interfaces';

@Injectable()
export class OtpService {
  constructor(private readonly drizzleService: DrizzleService) {}
  generateOtp(length: number = 6): string {
    return crypto
      .randomInt(0, Math.pow(10, length))
      .toString()
      .padStart(length, '0'); // Ensures it's zero-padded
  }

  hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  verifyOtp(otp: string, hashedOtp: string): boolean {
    const hashedInput = this.hashOtp(otp);
    return hashedInput === hashedOtp;
  }

  async generateAndSaveOtp(email: string, otpFor: OtpFor) {
    const otp = this.generateOtp();
    const hashedOtp = this.hashOtp(otp);
    const delay = 15 * 60 * 1000;
    const otpExpiresAt = new Date(Date.now() + delay); // OTP expires in 15 minutes

    await this.drizzleService.db
      .update(authTable)
      .set({
        otpHash: hashedOtp,
        otpExpiry: otpExpiresAt,
        otpFor: otpFor,
      })
      .where(eq(authTable.email, email));

    return { otp, expiryTime: `${delay / 60000}` }; // Send plain OTP to the user
  }

  async retriveAndVerifyOtp(
    email: string,
    otpFor: OtpFor,
    otp: string,
  ): Promise<void> {
    const otpDetails = (
      await this.drizzleService.db
        .select({
          otpHash: authTable.otpHash,
          otpExpiry: authTable.otpExpiry,
          otpFor: authTable.otpFor,
        })
        .from(authTable)
        .where(eq(authTable.email, email))
    ).pop();

    if (!otpDetails) {
      throw new InternalServerErrorException({
        reason: 'invalid-otp',
        message: 'Invalid OTP',
      } as ErrorResponse);
    }

    // if OTP is not valid throw error
    if (!this.verifyOtp(otp, otpDetails.otpHash)) {
      throw new InternalServerErrorException({
        reason: 'invalid-otp',
        message: 'Invalid OTP',
      } as ErrorResponse);
    }

    // if OTP is not for the current usage, throw error
    if (otpDetails.otpFor !== otpFor) {
      throw new InternalServerErrorException({
        reason: 'invalid-otp',
        message: 'Invalid OTP',
      } as ErrorResponse);
    }

    // if OTP has expired throw error
    if (otpDetails.otpExpiry > new Date()) {
      throw new InternalServerErrorException({
        reason: 'expired-otp',
        message: 'OTP has expired',
      } as ErrorResponse);
    }
  }

  async removeOtp(email: string): Promise<void> {
    await this.drizzleService.db
      .update(authTable)
      .set({
        // otpExpiry: null,
        // otpFor: null,
        // otpHash: null,
      })
      .where(eq(authTable.email, email));
  }
}
