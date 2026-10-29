import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { resolveUploadsDir } from '@/lib/server/db';
import { fetchUploadedMediaFromCpanel } from '@/lib/server/cpanelStorage';

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

export async function GET(
  _req: NextRequest,
  context: { params: { path: string[] } }
) {
  const segments = context.params?.path || [];
  const fileName = segments.join('/');
  const safeBaseName = path.basename(fileName);

  if (!safeBaseName || safeBaseName.startsWith('.')) {
    return new NextResponse('Not found', { status: 404 });
  }

  // 1. Check local public/uploads first
  try {
    const localFile = path.join(resolveUploadsDir(), safeBaseName);
    if (fs.existsSync(localFile) && fs.statSync(localFile).isFile()) {
      const buf = fs.readFileSync(localFile);
      const ext = path.extname(safeBaseName).toLowerCase();
      return new NextResponse(new Uint8Array(buf), {
        status: 200,
        headers: {
          'Content-Type': MIME_MAP[ext] || 'application/octet-stream',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch {
    // Fall through to remote cPanel storage
  }

  // 2. Fetch from cPanel Shared Hosting `/home/lijemriy/public_html/uploads/<safeBaseName>`
  const remote = await fetchUploadedMediaFromCpanel(safeBaseName);
  if (remote.status === 200 && remote.buffer.length > 0) {
    const ext = path.extname(safeBaseName).toLowerCase();
    return new NextResponse(new Uint8Array(remote.buffer), {
      status: 200,
      headers: {
        'Content-Type':
          MIME_MAP[ext] || remote.contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  return new NextResponse('File not found', { status: 404 });
}
