import { Injectable } from '@nestjs/common';
import { MailQueueService } from './mail-queue.service';

@Injectable()
export class MailJobsService {
  constructor(private readonly mailQueueService: MailQueueService) {}

  async sendSignupOtp(to: string, data: { otp: string }) {
    await this.mailQueueService.addEmailJob(
      to,
      'Confirm your email address',
      'signup-otp', // Template name
      data, // Template context
    );
  }

  async sendForgotPasswordOtp(
    to: string,
    data: { firstName: string; otp: string; expiryTime: string },
  ) {
    await this.mailQueueService.addEmailJob(
      to,
      'Reset your account password',
      'forgot-password-otp', // Template name
      data, // Template context
    );
  }
}
