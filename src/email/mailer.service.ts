import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, template: string, context: any) {
    return this.mailerService.sendMail({
      to,
      subject,
      template, // name of the EJS template
      context, // data for the template
    });
  }
}
