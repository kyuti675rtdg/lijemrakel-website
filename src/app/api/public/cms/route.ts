import { NextResponse } from 'next/server';
import {
  readDb,
  DEFAULT_SITE_IMAGES,
  mapAdminNewsToPublicArticles,
} from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = readDb();
  const publicNews = mapAdminNewsToPublicArticles(db.news, db.team);

  return NextResponse.json(
    {
      team: db.team,
      news: publicNews,
      products: db.products,
      categories: db.categories,
      media: db.media,
      siteImages: {
        ...DEFAULT_SITE_IMAGES,
        ...(db.siteImages || {}),
      },
      orbitConfig: db.orbitConfig,
      orbitFaqs: db.orbitFaqs,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
