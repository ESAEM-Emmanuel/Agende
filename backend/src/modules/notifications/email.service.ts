import nodemailer from 'nodemailer';
import { env } from '../../config/env';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT),
      secure: parseInt(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async send(to: string | string[], subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
      });
      console.log(`📧 Email envoyé à ${to}: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error('❌ Erreur envoi email:', err);
      throw err;
    }
  }
}

// import nodemailer from 'nodemailer';
// import { env } from '../../config/env';

// export class EmailService {
//   private transporter;

//   constructor() {
//     // Mode développement : utiliser Ethereal pour tester
//     if (process.env.NODE_ENV !== 'production') {
//       this.createTestAccount().then(account => {
//         this.transporter = nodemailer.createTransport({
//           host: 'smtp.ethereal.email',
//           port: 587,
//           secure: false,
//           auth: { user: account.user, pass: account.pass },
//         });
//         console.log('📧 Mode test SMTP — Voir les emails sur https://ethereal.email');
//       });
//     } else {
//       this.transporter = nodemailer.createTransport({
//         host: env.SMTP_HOST,
//         port: parseInt(env.SMTP_PORT),
//         secure: parseInt(env.SMTP_PORT) === 587,
//         auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
//       });
//     }
//   }

//   private async createTestAccount() {
//     return nodemailer.createTestAccount();
//   }

//   async send(to: string | string[], subject: string, html: string) {
//     try {
//       const info = await this.transporter.sendMail({
//         from: env.SMTP_FROM,
//         to: Array.isArray(to) ? to.join(', ') : to,
//         subject,
//         html,
//       });
//       if (process.env.NODE_ENV !== 'production') {
//         console.log('📧 Email test :', nodemailer.getTestMessageUrl(info));
//       }
//       return info;
//     } catch (err) {
//       console.error('❌ Erreur envoi email:', err);
//     }
//   }
// }