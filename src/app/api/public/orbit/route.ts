import { NextResponse } from 'next/server';
import { readDb } from '@/lib/server/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    orbitFaqs: db.orbitFaqs,
    orbitConfig: db.orbitConfig,
  });
}
