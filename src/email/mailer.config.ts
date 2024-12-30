import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const MailerConfig = MailerModule.forRoot({
  transport: {
    host: 'smtp.gmail.com', // Replace with your SMTP server
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'noahgerald65@gmail.com', // Replace with your email
      pass: 'qqueowiodsbfdcfg', // Replace with your email password
    },
  },
  defaults: {
    from: '"Rayna Telehealth" <noreply@raynaui.com>',
  },
  preview: true,
  template: {
    dir: path.join(__dirname, 'templates'), // Directory for email templates
    adapter: new HandlebarsAdapter(), // handlebars for templating
    options: {
      strict: true,
    },
  },
  options: {
    partials: {
      dir: path.join(__dirname, 'templates/partials'),
      options: {
        strict: true,
      },
    },
  },
});
