import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { validateEnv } from '../config/env.config';
import { config } from 'dotenv';

config();

export const env = validateEnv(process.env);

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      },
      defaults: {
        from: '"Kolok" <noreply@kolok.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
