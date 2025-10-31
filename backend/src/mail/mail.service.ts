import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(email: string, code: string) {
    console.log(`4`);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Vérification de votre compte',
      html: `
        <h1>Bienvenue !</h1>
        <p>Votre code de vérification est : <strong>${code}</strong></p>
        <p>Ce code expire dans 15 minutes.</p>
      `,
    });
    console.log(`5`);
  }
}
