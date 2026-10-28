import { NextRequest, NextResponse } from 'next/server';
import {
  hashPassword,
  signSessionToken,
  verifyPassword,
} from '@/lib/server/crypto';
import { appendAuditLog, readDb, writeDb } from '@/lib/server/db';
import { SESSION_COOKIE_NAME } from '@/lib/server/auth';

const loginAttemptsMap = new Map<
  string,
  { count: number; resetAt: number }
>();

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const now = Date.now();
    const rateRecord = loginAttemptsMap.get(ip);
    if (rateRecord && rateRecord.resetAt > now) {
      if (rateRecord.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
          {
            error:
              'Too many sign-in attempts from this IP address. Please wait 15 minutes before trying again.',
          },
          { status: 429 }
        );
      }
    } else {
      loginAttemptsMap.set(ip, { count: 0, resetAt: now + WINDOW_MS });
    }

    const body = await req.json();
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const password = String(body.password || '');
    const rememberMe = Boolean(body.rememberMe);

    if (!email || !email.includes('@') || !password) {
      return NextResponse.json(
        { error: 'Please enter a valid email address and password.' },
        { status: 400 }
      );
    }

    const db = readDb();
    const user = db.users.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      const cur = loginAttemptsMap.get(ip) || {
        count: 0,
        resetAt: now + WINDOW_MS,
      };
      cur.count += 1;
      loginAttemptsMap.set(ip, cur);
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        {
          error:
            'Your account has been deactivated. Please contact a Super Administrator.',
        },
        { status: 403 }
      );
    }

    let isPasswordValid = verifyPassword(password, user.passwordHash);

    // Bootstrap admin sync check against environment variables
    const envBootstrapEmail = (
      process.env.BOOTSTRAP_ADMIN_EMAIL ||
      process.env.SMTP_USER ||
      ''
    )
      .trim()
      .toLowerCase();
    const envBootstrapPass =
      process.env.BOOTSTRAP_ADMIN_PASSWORD || process.env.SMTP_PASS || '';

    if (
      !isPasswordValid &&
      envBootstrapEmail &&
      envBootstrapPass &&
      email === envBootstrapEmail &&
      password === envBootstrapPass
    ) {
      user.passwordHash = hashPassword(password);
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      const cur = loginAttemptsMap.get(ip) || {
        count: 0,
        resetAt: now + WINDOW_MS,
      };
      cur.count += 1;
      loginAttemptsMap.set(ip, cur);
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Clear rate-limit counter on successful authentication
    loginAttemptsMap.delete(ip);

    const role =
      db.roles.find((r) => r.id === user.roleId) ||
      db.roles.find((r) => r.id === 'ROLE-SUPER-ADMIN') ||
      db.roles[0];

    user.lastLoginAt = new Date().toISOString();
    user.roleName = role.name;

    appendAuditLog(db, {
      actorName: user.fullName,
      actorEmail: user.email,
      module: 'auth',
      action: 'Signed in to Admin Panel',
      target: user.email,
      ipAddress: ip,
    });
    writeDb(db);

    const ttlSeconds = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    const token = signSessionToken(
      {
        userId: user.id,
        email: user.email,
        roleId: role.id,
      },
      ttlSeconds
    );

    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleId: role.id,
        roleName: role.name,
        status: user.status,
        department: user.department,
        permissions: role.permissions,
        lastLoginAt: user.lastLoginAt,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: ttlSeconds,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
