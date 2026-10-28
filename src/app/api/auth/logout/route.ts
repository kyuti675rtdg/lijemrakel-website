import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedUserFromRequest,
  SESSION_COOKIE_NAME,
} from '@/lib/server/auth';
import { appendAuditLog, readDb, writeDb } from '@/lib/server/db';

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUserFromRequest(req);
  if (user) {
    const db = readDb();
    appendAuditLog(db, {
      actorName: user.fullName,
      actorEmail: user.email,
      module: 'auth',
      action: 'Signed out of Admin Panel',
      target: user.email,
    });
    writeDb(db);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
