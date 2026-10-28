import { NextRequest, NextResponse } from 'next/server';
import { generateSecureToken } from '@/lib/server/crypto';
import { appendAuditLog, readDb, writeDb } from '@/lib/server/db';
import { getSmtpStatus, sendPasswordResetEmail } from '@/lib/server/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || '')
      .trim()
      .toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const smtpStatus = getSmtpStatus();
    if (!smtpStatus.configured) {
      return NextResponse.json(
        {
          error: `SMTP email service is not configured. Missing environment variables: ${smtpStatus.missingVars.join(', ')}`,
        },
        { status: 503 }
      );
    }

    const db = readDb();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email && u.status === 'active'
    );

    if (!user) {
      return NextResponse.json(
        {
          error:
            'No active administrator account was found with that email address.',
        },
        { status: 404 }
      );
    }

    const token = generateSecureToken(24);
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

    db.passwordResetTokens = [
      {
        token,
        userId: user.id,
        email: user.email,
        expiresAt,
        used: false,
      },
      ...db.passwordResetTokens.filter((t) => t.expiresAt > Date.now()),
    ];

    const origin =
      process.env.APP_URL || req.headers.get('origin') || 'http://localhost:3000';
    const resetUrl = `${origin.replace(/\/$/, '')}/adminlogin?resetToken=${token}`;

    const mailResult = await sendPasswordResetEmail({
      toEmail: user.email,
      fullName: user.fullName,
      resetUrl,
    });

    appendAuditLog(db, {
      actorName: user.fullName,
      actorEmail: user.email,
      module: 'auth',
      action: 'Password recovery email sent via SMTP',
      target: `${user.email} (${mailResult.messageId})`,
    });
    writeDb(db);

    return NextResponse.json({
      ok: true,
      message: `Password recovery link has been sent to ${user.email} via ${smtpStatus.host}.`,
      messageId: mailResult.messageId,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Failed to send password recovery email via SMTP.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
