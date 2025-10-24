import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // ou ton service SMTP
        port: 587,
        secure: false,
        auth: {
          user: 'ton-email@gmail.com',
          pass: 'ton-mot-de-passe-app', // Mot de passe d'application Gmail
        },
      },
      defaults: {
        from: '"Mon App" <noreply@monapp.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
