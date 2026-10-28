import nodemailer from 'nodemailer';

export interface SmtpConfigStatus {
  configured: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  supportRecipient: string;
  appUrl: string;
  missingVars: string[];
}

export function getSmtpStatus(): SmtpConfigStatus {
  const host = process.env.SMTP_HOST || '';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const supportRecipient =
    process.env.SUPPORT_RECIPIENT_EMAIL || 'tekacreative.cloud@gmail.com';
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  const missingVars: string[] = [];
  if (!host) missingVars.push('SMTP_HOST');
  if (!process.env.SMTP_PORT) missingVars.push('SMTP_PORT');
  if (!user) missingVars.push('SMTP_USER');
  if (!pass) missingVars.push('SMTP_PASS');

  return {
    configured: missingVars.length === 0,
    host,
    port,
    secure: port === 465,
    user,
    supportRecipient,
    appUrl,
    missingVars,
  };
}

function createTransporter() {
  const status = getSmtpStatus();
  if (!status.configured) {
    throw new Error(
      `SMTP is not configured. Missing environment variables: ${status.missingVars.join(', ')}`
    );
  }

  return nodemailer.createTransport({
    host: status.host,
    port: status.port,
    secure: status.secure, // true for port 465 (implicit TLS)
    auth: {
      user: status.user,
      pass: process.env.SMTP_PASS as string,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

export async function verifySmtpConnection(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    const status = getSmtpStatus();
    return {
      ok: true,
      message: `Connected to ${status.host}:${status.port} (Implicit TLS) as ${status.user}`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown SMTP error';
    return { ok: false, message: msg };
  }
}

export async function sendPasswordResetEmail(params: {
  toEmail: string;
  fullName: string;
  resetUrl: string;
}): Promise<{ messageId: string }> {
  const status = getSmtpStatus();
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0B0E29; padding: 24px 32px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px; color: #ffffff;">Lijemrakel Trading PLC</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #F7941D; text-transform: uppercase; letter-spacing: 1px;">Admin Portal Password Recovery</p>
      </div>
      <div style="padding: 32px; background-color: #ffffff; color: #1f2937; line-height: 1.6;">
        <p style="margin-top: 0;">Hello <strong>${params.fullName}</strong>,</p>
        <p>We received a request to reset the password for your Lijemrakel Trading PLC Admin Portal account (<strong>${params.toEmail}</strong>).</p>
        <p style="margin: 28px 0;">
          <a href="${params.resetUrl}" style="display: inline-block; background-color: #0B0E29; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 10px; font-size: 14px;">
            Reset Admin Password
          </a>
        </p>
        <p style="font-size: 13px; color: #4b5563;">Or copy and paste this URL into your browser:<br/>
          <a href="${params.resetUrl}" style="color: #0B0E29; word-break: break-all;">${params.resetUrl}</a>
        </p>
        <p style="font-size: 12px; color: #6b7280; margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
          This password recovery link expires in 30 minutes. If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"Lijemrakel Trading PLC Admin" <${status.user}>`,
    to: params.toEmail,
    subject: 'Password Reset Request — Lijemrakel Trading PLC Admin',
    text: `Hello ${params.fullName},\n\nReset your Lijemrakel Trading PLC Admin password using the link below (valid for 30 minutes):\n${params.resetUrl}\n\nIf you did not request this, please ignore this email.`,
    html,
  });

  return { messageId: info.messageId };
}

export async function sendInquiryReplyEmail(params: {
  toEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  repliedByName: string;
  replyToEmail?: string;
}): Promise<{ messageId: string }> {
  const status = getSmtpStatus();
  const transporter = createTransporter();

  const cleanSubject = params.subject.startsWith('Re:')
    ? params.subject
    : `Re: ${params.subject}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0B0E29; padding: 22px 28px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 18px; color: #ffffff;">Lijemrakel Trading PLC</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #F7941D;">Debrewerk Tower | Mexico · Addis Ababa, Ethiopia · Tel: 0913514767</p>
      </div>
      <div style="padding: 28px; background-color: #ffffff; color: #1f2937; line-height: 1.65;">
        <p style="margin-top: 0;">Dear <strong>${params.recipientName}</strong>,</p>
        <div style="white-space: pre-wrap; font-size: 14px; color: #111827; margin: 16px 0 24px;">${params.body}</div>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 12px; color: #4b5563;">
          <strong>${params.repliedByName}</strong><br/>
          Lijemrakel Trading PLC — Veterinary, Livestock &amp; Poultry Solutions<br/>
          Debrewerk Tower | Mexico | ደብረወርቅ ህንጻ | ሜክሲኮ, Addis Ababa<br/>
          Phone: 0913514767 · Email: inquiries@lijemrakel.com
        </div>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"Lijemrakel Trading PLC" <${status.user}>`,
    replyTo: params.replyToEmail || 'inquiries@lijemrakel.com',
    to: params.toEmail,
    subject: cleanSubject,
    text: `Dear ${params.recipientName},\n\n${params.body}\n\n--\n${params.repliedByName}\nLijemrakel Trading PLC\nDebrewerk Tower | Mexico, Addis Ababa\nTel: 0913514767`,
    html,
  });

  return { messageId: info.messageId };
}

export async function sendOrbitSupportEmail(params: {
  ticketId: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
  submittedByName: string;
  submittedByEmail: string;
  contactEmail: string;
  contactPhone: string;
}): Promise<{ messageId: string; recipient: string }> {
  const status = getSmtpStatus();
  const transporter = createTransporter();
  const recipient = status.supportRecipient;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0B0E29; padding: 22px 28px; color: #ffffff;">
        <span style="display: inline-block; background-color: #F7941D; color: #0B0E29; font-weight: bold; font-size: 11px; padding: 3px 10px; border-radius: 999px; text-transform: uppercase;">
          Support Ticket ${params.ticketId} · ${params.priority} Priority
        </span>
        <h2 style="margin: 10px 0 0; font-size: 19px; color: #ffffff;">${params.subject}</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #d1d5db;">Submitted from Lijemrakel Trading PLC Admin Panel</p>
      </div>
      <div style="padding: 28px; background-color: #ffffff; color: #1f2937;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 150px;"><strong>Ticket ID:</strong></td>
            <td style="padding: 8px 0; color: #111827;">${params.ticketId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Category:</strong></td>
            <td style="padding: 8px 0; color: #111827;">${params.category}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Priority:</strong></td>
            <td style="padding: 8px 0; color: #111827;">${params.priority}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Requested By:</strong></td>
            <td style="padding: 8px 0; color: #111827;">${params.submittedByName} (${params.submittedByEmail})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Callback Contact:</strong></td>
            <td style="padding: 8px 0; color: #111827;">${params.contactEmail} · ${params.contactPhone}</td>
          </tr>
        </table>
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #111827;">${params.message}</div>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"Lijemrakel Admin Support Desk" <${status.user}>`,
    replyTo: params.contactEmail || params.submittedByEmail,
    to: recipient,
    subject: `[Lijemrakel Support ${params.ticketId}] [${params.priority}] ${params.subject}`,
    text: `Support Ticket: ${params.ticketId}\nCategory: ${params.category}\nPriority: ${params.priority}\nRequested By: ${params.submittedByName} (${params.submittedByEmail})\nContact: ${params.contactEmail} / ${params.contactPhone}\n\nMessage:\n${params.message}`,
    html,
  });

  return { messageId: info.messageId, recipient };
}
