import { NextRequest, NextResponse } from 'next/server';
import { hashVisitorFingerprint } from '@/lib/server/crypto';
import { readDb, writeDb } from '@/lib/server/db';

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  'Africa/Addis_Ababa': 'ET',
  'Africa/Nairobi': 'KE',
  'Africa/Djibouti': 'DJ',
  'Africa/Khartoum': 'SD',
  'Africa/Cairo': 'EG',
  'Africa/Johannesburg': 'ZA',
  'Africa/Lagos': 'NG',
  'Africa/Casablanca': 'MA',
  'Africa/Accra': 'GH',
  'Africa/Kampala': 'UG',
  'Africa/Dar_es_Salaam': 'TZ',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Europe/Istanbul': 'TR',
  'Europe/Amsterdam': 'NL',
  'Europe/Berlin': 'DE',
  'Europe/Paris': 'FR',
  'Europe/London': 'GB',
  'Europe/Rome': 'IT',
  'Europe/Brussels': 'BE',
  'Europe/Madrid': 'ES',
  'Europe/Zurich': 'CH',
  'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO',
  'Europe/Moscow': 'RU',
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Asia/Shanghai': 'CN',
  'Asia/Hong_Kong': 'CN',
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Asia/Singapore': 'SG',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Phoenix': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Montreal': 'CA',
  'America/Sao_Paulo': 'BR',
  'America/Buenos_Aires': 'AR',
  'America/Mexico_City': 'MX',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
};

function resolveCountryCode(
  req: NextRequest,
  timezone?: string,
  locale?: string
): string {
  const geoHeaders = [
    'x-vercel-ip-country',
    'cf-ipcountry',
    'x-country-code',
    'cloudfront-viewer-country',
    'x-appengine-country',
  ];
  for (const h of geoHeaders) {
    const val = req.headers.get(h);
    if (val && val.length === 2 && val !== 'XX' && val !== 'ZZ') {
      return val.toUpperCase();
    }
  }

  if (timezone) {
    if (TIMEZONE_TO_COUNTRY[timezone]) {
      return TIMEZONE_TO_COUNTRY[timezone];
    }
    if (timezone.startsWith('America/')) return 'US';
    if (timezone.startsWith('Australia/')) return 'AU';
    if (timezone.startsWith('Europe/')) return 'DE';
  }

  if (locale && locale.includes('-')) {
    const parts = locale.split('-');
    const region = parts[parts.length - 1]?.toUpperCase();
    if (region && region.length === 2 && region !== 'US' && region !== 'GB') {
      return region;
    }
  }

  return 'ET';
}

function detectDeviceType(userAgent: string): 'Desktop' | 'Mobile' | 'Tablet' {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) {
    return 'Tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function classifyReferrer(referrer?: string): string {
  if (!referrer) return 'Direct';
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (
      host.includes('localhost') ||
      host.includes('lijemrakel') ||
      host.includes('vercel.app')
    ) {
      return 'Direct';
    }
    if (
      host.includes('google') ||
      host.includes('bing') ||
      host.includes('duckduckgo') ||
      host.includes('yahoo') ||
      host.includes('baidu') ||
      host.includes('yandex')
    ) {
      return 'Organic Search';
    }
    if (
      host.includes('wa.me') ||
      host.includes('whatsapp') ||
      host.includes('t.me') ||
      host.includes('linkedin') ||
      host.includes('facebook') ||
      host.includes('instagram') ||
      host.includes('twitter') ||
      host.includes('x.com') ||
      host.includes('youtube')
    ) {
      return 'Social Media';
    }
    if (
      host.includes('mail.') ||
      host.includes('gmail') ||
      host.includes('outlook') ||
      host.includes('newsletter')
    ) {
      return 'Email';
    }
    return 'Referral';
  } catch {
    return 'Direct';
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = String(body.path || '/').trim();

    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ tracked: false });
    }

    const pageTitle = String(body.pageTitle || path).trim();
    const referrer = String(body.referrer || '');
    const timezone = String(body.timezone || '');
    const locale = String(body.locale || req.headers.get('accept-language')?.split(',')[0] || '');

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser';

    const visitorHash = hashVisitorFingerprint(ip, userAgent);
    const countryCode = resolveCountryCode(req, timezone, locale);
    const deviceType = detectDeviceType(userAgent);
    const referrerSource = classifyReferrer(referrer);

    const db = readDb();
    const nowIso = new Date().toISOString();
    const nowMs = Date.now();

    // Prevent React StrictMode double-firing from recording duplicate pageviews within 1.5s
    const lastEvent = db.analyticsEvents[db.analyticsEvents.length - 1];
    if (
      lastEvent &&
      lastEvent.visitorHash === visitorHash &&
      lastEvent.path === path &&
      Math.abs(nowMs - new Date(lastEvent.timestamp).getTime()) < 1500
    ) {
      return NextResponse.json({
        tracked: true,
        deduplicated: true,
        countryCode,
        deviceType,
      });
    }

    db.analyticsEvents.push({
      id: `EVT-${nowMs}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: nowIso,
      visitorHash,
      path,
      pageTitle,
      countryCode,
      deviceType,
      referrerSource,
    });

    // Keep most recent 10,000 events
    if (db.analyticsEvents.length > 10000) {
      db.analyticsEvents = db.analyticsEvents.slice(-10000);
    }

    writeDb(db);

    return NextResponse.json({
      tracked: true,
      countryCode,
      deviceType,
    });
  } catch {
    return NextResponse.json({ tracked: false }, { status: 200 });
  }
}
