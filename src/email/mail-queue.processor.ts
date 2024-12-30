import { Processor, WorkerHost } from '@nestjs/bullmq';
import { AppMailerService } from './mailer.service';

@Processor('mail-queue')
export class MailQueueProcessor extends WorkerHost {
  constructor(private readonly mailerService: AppMailerService) {
    super();
  }

  async process(job: any) {
    const { to, subject, template, context } = job.data;

    try {
      await this.mailerService.sendEmail(to, subject, template, context);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
    }
  }
}
