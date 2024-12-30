import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailQueueService } from './mail-queue.service';
import { MailQueueProcessor } from './mail-queue.processor';
import { AppMailerService } from './mailer.service';
import { BullMQConfig } from './queue.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfig } from './mailer.config';

@Module({
  imports: [
    BullMQConfig,
    MailerConfig,
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
    MailerModule,
  ],
  providers: [MailQueueService, MailQueueProcessor, AppMailerService],
  exports: [MailQueueService, BullModule],
})
export class MailQueueModule {}
