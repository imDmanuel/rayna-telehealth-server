import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from 'src/hashing/hashing.service';
import { BcryptService } from 'src/hashing/bcrypt.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { JwtModule } from '@nestjs/jwt';
import { MailJobsService } from 'src/email/mail-jobs.service';
import { OtpService } from 'src/otp/otp.service';
import { MailQueueModule } from 'src/email/mail-queue.module';
import { MailQueueService } from 'src/email/mail-queue.service';
import { JWT_SECRET, JWT_TTL } from 'src/lib/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    DrizzleModule,
    JwtModule.register({
      secret: process.env[JWT_SECRET],
      signOptions: {
        expiresIn: process.env[JWT_TTL],
      },
    }),
    MailQueueModule,
  ],
  providers: [
    AuthService,
    MailJobsService,
    MailQueueService,
    OtpService,
    JwtStrategy,
    LocalStrategy,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
