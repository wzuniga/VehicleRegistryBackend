import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: Number(this.configService.get('SMTP_PORT') ?? 587),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendPreregistrationEmail(toEmail: string, registerUrl: string): Promise<void> {
    const fromName = this.configService.get('SMTP_FROM_NAME') ?? 'Auto Check';
    const fromEmail = this.configService.get('SMTP_USER');

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Invitación Auto Check</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:100%;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:36px 40px;text-align:center;">
          <div style="font-size:2rem;font-weight:900;background:linear-gradient(90deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:inline-block;">Auto Check</div>
          <p style="color:#94a3b8;margin:8px 0 0;font-size:0.9rem;">Consulta el historial de cualquier vehículo</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px;">
          <h2 style="color:#1e293b;font-size:1.4rem;font-weight:800;margin:0 0 16px;">¡Tienes 15 créditos esperándote!</h2>
          <p style="color:#475569;line-height:1.7;font-size:0.97rem;margin:0 0 12px;">
            Fuiste invitado a usar <strong>Auto Check</strong>, la plataforma para consultar el historial vehicular completo en Perú.
          </p>
          <p style="color:#475569;line-height:1.7;font-size:0.97rem;margin:0 0 28px;">
            Regístrate con el mismo correo donde te llegó este mensaje y recibirás
            <strong style="color:#3b82f6;font-size:1.05rem;"> 15 créditos</strong> para comenzar a consultar de inmediato.
          </p>
          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 32px;">
            <a href="${registerUrl}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6 0%,#6366f1 100%);color:white;text-decoration:none;padding:15px 40px;border-radius:10px;font-weight:700;font-size:1rem;letter-spacing:0.3px;">
              Crear mi cuenta gratis
            </a>
          </td></tr></table>
          <!-- Note -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;font-size:0.82rem;color:#64748b;line-height:1.5;">
            Regístrate con el mismo correo donde recibiste este mensaje: <strong style="color:#1e293b;">${toEmail}</strong>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
          <p style="color:#94a3b8;font-size:0.78rem;margin:0;">© ${new Date().getFullYear()} Auto Check · Todos los derechos reservados</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await this.transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: toEmail,
        subject: '¡Tienes 15 créditos esperándote en Auto Check!',
        html,
      });
      this.logger.log(`Preregistration email sent to ${toEmail}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${toEmail}: ${err.message}`);
      throw err;
    }
  }
}
