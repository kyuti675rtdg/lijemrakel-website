import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/server/crypto';
import { appendAuditLog, readDb, writeDb } from '@/lib/server/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = String(body.token || '').trim();
    const newPassword = String(body.newPassword || '');

    if (!token) {
      return NextResponse.json(
        { error: 'Missing password reset token.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const db = readDb();
    const tokenRecord = db.passwordResetTokens.find(
      (t) => t.token === token && !t.used
    );

    if (!tokenRecord || tokenRecord.expiresAt < Date.now()) {
      return NextResponse.json(
        {
          error:
            'This password reset link is invalid or has expired. Please request a new reset link.',
        },
        { status: 400 }
      );
    }

    const user = db.users.find((u) => u.id === tokenRecord.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      );
    }

    user.passwordHash = hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();
    tokenRecord.used = true;

    appendAuditLog(db, {
      actorName: user.fullName,
      actorEmail: user.email,
      module: 'auth',
      action: 'Password reset completed',
      target: user.email,
    });

    writeDb(db);

    return NextResponse.json({
      ok: true,
      message: 'Your password has been updated. You can now sign in.',
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to reset password.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
