import { NextResponse } from 'next/server';
import { readDb } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = readDb();
  return NextResponse.json(
    {
      orbitFaqs: db.orbitFaqs,
      orbitConfig: db.orbitConfig,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
