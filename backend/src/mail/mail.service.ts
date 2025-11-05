import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { env } from '../main';

@Injectable()
export class MailService {
  private resend: Resend;
  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async sendVerificationEmail(email: string, code: string) {
    console.log(`4`);
    await this.resend.emails.send({
      from: 'Kolok <noreply@kolokapp.com>',
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
