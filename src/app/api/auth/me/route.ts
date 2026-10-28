import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserFromRequest } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user,
  });
}
