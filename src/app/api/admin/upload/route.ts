import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  getAuthenticatedUserFromRequest,
  hasModulePermission,
} from '@/lib/server/auth';
import { appendAuditLog, readDb, writeDb } from '@/lib/server/db';
import { MediaAssetItem, SiteImagesConfig } from '@/types/admin';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canUpload =
      hasModulePermission(user, 'media', 'create') ||
      hasModulePermission(user, 'media', 'edit') ||
      hasModulePermission(user, 'teams', 'create') ||
      hasModulePermission(user, 'teams', 'edit') ||
      hasModulePermission(user, 'news', 'create') ||
      hasModulePermission(user, 'news', 'edit') ||
      hasModulePermission(user, 'products', 'create') ||
      hasModulePermission(user, 'products', 'edit') ||
      hasModulePermission(user, 'seo', 'edit');

    if (!canUpload) {
      return NextResponse.json(
        { error: 'You do not have permission to upload or replace images.' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = String(formData.get('title') || '').trim();
    const category = (formData.get('category') ||
      'Hero & Office') as MediaAssetItem['category'];
    const altText = String(formData.get('altText') || '').trim();
    const replaceAssetId = String(formData.get('replaceAssetId') || '').trim();
    const siteImageKey = String(formData.get('siteImageKey') || '').trim() as
      | keyof SiteImagesConfig
      | '';

    if (!file) {
      return NextResponse.json(
        { error: 'Please select an image or file from your computer.' },
        { status: 400 }
      );
    }

    const maxBytes = 15 * 1024 * 1024; // 15 MB
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: 'File size exceeds the 15 MB limit.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeOriginalName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-');
    const uniqueFileName = `${Date.now()}-${safeOriginalName}`;

    let publicUrl = '';
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const targetPath = path.join(uploadsDir, uniqueFileName);
      fs.writeFileSync(targetPath, buffer);
      publicUrl = `/uploads/${uniqueFileName}`;
    } catch {
      const mime = file.type || 'image/jpeg';
      publicUrl = `data:${mime};base64,${buffer.toString('base64')}`;
    }

    const ext =
      path.extname(safeOriginalName).replace('.', '').toUpperCase() ||
      file.type.split('/')[1]?.toUpperCase() ||
      'IMAGE';
    const sizeKb = Math.max(1, Math.round(file.size / 1024));

    const db = readDb();
    let resultAsset: MediaAssetItem;

    if (replaceAssetId) {
      const existing = db.media.find((m) => m.id === replaceAssetId);
      const oldUrl = existing?.url;

      if (existing) {
        resultAsset = {
          ...existing,
          title: title || existing.title,
          fileName: safeOriginalName,
          url: publicUrl,
          category: category || existing.category,
          fileType: `${ext} (${sizeKb} KB)`,
          sizeBytes: file.size,
          dimensions: `${sizeKb} KB`,
          uploadedAt: new Date().toISOString().slice(0, 10),
          uploadedBy: user.fullName,
          altText: altText || title || existing.altText,
        };
        db.media = db.media.map((m) =>
          m.id === replaceAssetId ? resultAsset : m
        );

        // Cascade replaced URL across team, news, products, seo, and siteImages
        if (oldUrl && oldUrl !== publicUrl) {
          db.team = db.team.map((t) =>
            t.portraitUrl === oldUrl ? { ...t, portraitUrl: publicUrl } : t
          );
          db.news = db.news.map((n) =>
            n.image === oldUrl ? { ...n, image: publicUrl } : n
          );
          db.products = db.products.map((p) =>
            p.image === oldUrl ? { ...p, image: publicUrl } : p
          );
          db.seo = db.seo.map((s) =>
            s.ogImage === oldUrl ? { ...s, ogImage: publicUrl } : s
          );
          for (const k of Object.keys(db.siteImages) as Array<
            keyof SiteImagesConfig
          >) {
            if (db.siteImages[k] === oldUrl) {
              db.siteImages[k] = publicUrl;
            }
          }
        }

        appendAuditLog(db, {
          actorName: user.fullName,
          actorEmail: user.email,
          module: 'media',
          action: 'Replaced media file',
          target: `${resultAsset.title} (${resultAsset.fileName})`,
        });
      } else {
        resultAsset = {
          id: replaceAssetId,
          title: title || file.name.replace(/\.[^/.]+$/, ''),
          fileName: safeOriginalName,
          url: publicUrl,
          category,
          fileType: `${ext} (${sizeKb} KB)`,
          sizeBytes: file.size,
          dimensions: `${sizeKb} KB`,
          uploadedAt: new Date().toISOString().slice(0, 10),
          uploadedBy: user.fullName,
          altText: altText || title || safeOriginalName,
        };
        db.media = [resultAsset, ...db.media];
      }
    } else {
      resultAsset = {
        id: `MEDIA-${Date.now().toString().slice(-6)}`,
        title: title || file.name.replace(/\.[^/.]+$/, ''),
        fileName: safeOriginalName,
        url: publicUrl,
        category,
        fileType: `${ext} (${sizeKb} KB)`,
        sizeBytes: file.size,
        dimensions: `${sizeKb} KB`,
        uploadedAt: new Date().toISOString().slice(0, 10),
        uploadedBy: user.fullName,
        altText: altText || title || safeOriginalName,
      };
      db.media = [resultAsset, ...db.media];
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'media',
        action: 'Uploaded media file',
        target: `${resultAsset.title} (${resultAsset.fileName})`,
      });
    }

    if (siteImageKey && siteImageKey in db.siteImages) {
      db.siteImages[siteImageKey] = publicUrl;
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'media',
        action: `Updated website section photo (${siteImageKey})`,
        target: resultAsset.title,
      });
    }

    writeDb(db);

    return NextResponse.json({
      ok: true,
      asset: resultAsset,
      media: db.media,
      siteImages: db.siteImages,
      team: db.team,
      news: db.news,
      products: db.products,
      auditLogs: db.auditLogs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
