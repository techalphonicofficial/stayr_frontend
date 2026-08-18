import nodemailer from 'nodemailer';

// Abstract Email Service Provider
// Can easily be swapped for SendGrid, Resend, etc.
class EmailProvider {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: process.env.EMAIL_PORT || 2525,
      auth: {
        user: process.env.EMAIL_USER || 'testuser',
        pass: process.env.EMAIL_PASS || 'testpass',
      },
    });
  }

  async send({ to, subject, html }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'STAYR'}" <${process.env.FROM_EMAIL || 'noreply@stayr.com'}>`,
        to,
        subject,
        html,
      });
      console.log(`[EmailService] Email sent successfully to ${to}. Msg ID: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`[EmailService] Failed to send email to ${to}. Error: ${error.message}`);
      // Do not throw error to avoid crashing the main request thread
      return null;
    }
  }
}

const emailProvider = new EmailProvider();

export const sendEmail = async (options) => {
  return emailProvider.send(options);
};
