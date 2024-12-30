import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue('mail-queue') private readonly mailQueue: Queue) {}

  async addEmailJob(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    await this.mailQueue.add('send-email', {
      to,
      subject,
      template,
      context,
    });
  }
}
