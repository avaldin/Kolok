import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { validateEnv } from '../config/env.config';
import { config } from 'dotenv';

config();

export const env = validateEnv(process.env);

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
