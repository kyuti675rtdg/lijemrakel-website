import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedUserFromRequest,
  hasModulePermission,
} from '@/lib/server/auth';
import { hashPassword } from '@/lib/server/crypto';
import {
  appendAuditLog,
  computeRealAnalyticsSummary,
  readDb,
  sanitizeUserForClient,
  writeDb,
} from '@/lib/server/db';
import { getSmtpStatus } from '@/lib/server/mailer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const daysParam = Number(req.nextUrl.searchParams.get('days') || 30);
  const days = [7, 30, 90, 365].includes(daysParam) ? daysParam : 30;
  const startDate = req.nextUrl.searchParams.get('startDate') || undefined;
  const endDate = req.nextUrl.searchParams.get('endDate') || undefined;

  const db = readDb();
  const analytics = computeRealAnalyticsSummary(
    db.analyticsEvents,
    days,
    startDate && endDate ? { startDate, endDate } : undefined
  );
  const smtpStatus = getSmtpStatus();

  return NextResponse.json({
    user,
    analytics,
    smtpStatus,
    inquiries: db.inquiries,
    products: db.products,
    categories: db.categories,
    news: db.news,
    team: db.team,
    media: db.media,
    siteImages: db.siteImages,
    orbitFaqs: db.orbitFaqs,
    orbitConfig: db.orbitConfig,
    seo: db.seo,
    users: db.users.map(sanitizeUserForClient),
    roles: db.roles,
    supportTickets: db.supportTickets,
    auditLogs: db.auditLogs,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = String(body.action || '');
    const db = readDb();

    // Public endpoint action: Contact page inquiry submission
    if (action === 'addInquiry' && body.inquiry) {
      const inq = body.inquiry;
      if (!inq.senderName || !inq.email || !inq.message) {
        return NextResponse.json(
          { error: 'Name, email, and message are required.' },
          { status: 400 }
        );
      }

      const newInquiry = {
        id: inq.id || `INQ-${Date.now().toString().slice(-6)}`,
        senderName: String(inq.senderName).trim(),
        organization: String(inq.organization || 'Direct Client').trim(),
        email: String(inq.email).trim(),
        phone: String(inq.phone || '').trim(),
        country: String(inq.country || 'Ethiopia').trim(),
        inquiryType: inq.inquiryType || 'General Business',
        subject: String(inq.subject || 'Website Contact Inquiry').trim(),
        message: String(inq.message).trim(),
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'unread' as const,
        assignedDepartment:
          inq.assignedDepartment || 'Commercial & Technical Desk',
        replies: [],
      };

      db.inquiries = [newInquiry, ...db.inquiries];
      appendAuditLog(db, {
        actorName: newInquiry.senderName,
        actorEmail: newInquiry.email,
        module: 'inbox',
        action: 'Submitted website contact inquiry',
        target: newInquiry.subject,
      });
      writeDb(db);
      return NextResponse.json({ ok: true, inquiry: newInquiry });
    }

    // All other actions require an authenticated admin session
    const user = getAuthenticatedUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ==========================================
    // INBOX ACTIONS
    // ==========================================
    if (action === 'updateInquiryStatus') {
      if (!hasModulePermission(user, 'inbox', 'edit')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const { id, status } = body;
      const target = db.inquiries.find((i) => i.id === id);
      if (target) {
        target.status = status;
        appendAuditLog(db, {
          actorName: user.fullName,
          actorEmail: user.email,
          module: 'inbox',
          action: `Marked inquiry as ${status}`,
          target: `${target.senderName} (${target.id})`,
        });
        writeDb(db);
      }
    } else if (action === 'deleteInquiry') {
      if (!hasModulePermission(user, 'inbox', 'delete')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const target = db.inquiries.find((i) => i.id === body.id);
      db.inquiries = db.inquiries.filter((i) => i.id !== body.id);
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'inbox',
        action: 'Deleted inquiry',
        target: target ? `${target.senderName} (${target.id})` : body.id,
      });
      writeDb(db);
    }

    // ==========================================
    // NEWS ACTIONS
    // ==========================================
    else if (action === 'upsertNews' && body.article) {
      const exists = db.news.some((n) => n.id === body.article.id);
      const perm = exists ? 'edit' : 'create';
      if (!hasModulePermission(user, 'news', perm)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (exists) {
        db.news = db.news.map((n) =>
          n.id === body.article.id ? body.article : n
        );
      } else {
        db.news = [body.article, ...db.news];
      }
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'news',
        action: exists
          ? `Updated article (${body.article.status})`
          : `Created article (${body.article.status})`,
        target: body.article.title,
      });
      writeDb(db);
    } else if (action === 'deleteNews') {
      if (!hasModulePermission(user, 'news', 'delete')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const target = db.news.find((n) => n.id === body.id);
      db.news = db.news.filter((n) => n.id !== body.id);
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'news',
        action: 'Deleted news article',
        target: target?.title || body.id,
      });
      writeDb(db);
    }

    // ==========================================
    // PRODUCTS & CATEGORIES ACTIONS
    // ==========================================
    else if (action === 'upsertProduct' && body.product) {
      const exists = db.products.some((p) => p.id === body.product.id);
      const perm = exists ? 'edit' : 'create';
      if (!hasModulePermission(user, 'products', perm)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (exists) {
        db.products = db.products.map((p) =>
          p.id === body.product.id ? body.product : p
        );
      } else {
        db.products = [body.product, ...db.products];
      }
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'products',
        action: exists ? 'Updated product' : 'Created product',
        target: body.product.name,
      });
      writeDb(db);
    } else if (action === 'deleteProduct') {
      if (!hasModulePermission(user, 'products', 'delete')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const target = db.products.find((p) => p.id === body.id);
      db.products = db.products.filter((p) => p.id !== body.id);
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'products',
        action: 'Deleted product',
        target: target?.name || body.id,
      });
      writeDb(db);
    } else if (action === 'upsertCategory' && body.category) {
      const exists = db.categories.some((c) => c.id === body.category.id);
      const perm = exists ? 'edit' : 'create';
      if (!hasModulePermission(user, 'products', perm)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (exists) {
        db.categories = db.categories.map((c) =>
          c.id === body.category.id ? body.category : c
        );
      } else {
        db.categories = [...db.categories, body.category];
      }
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'products',
        action: exists
          ? 'Updated product category'
          : 'Created product category',
        target: body.category.name,
      });
      writeDb(db);
    } else if (action === 'deleteCategory') {
      if (!hasModulePermission(user, 'products', 'delete')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const target = db.categories.find((c) => c.id === body.id);
      db.categories = db.categories.filter((c) => c.id !== body.id);
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'products',
        action: 'Deleted product category',
        target: target?.name || body.id,
      });
      writeDb(db);
    }

    // ==========================================
    // TEAMS ACTIONS
    // ==========================================
    else if (action === 'upsertTeamMember' && body.member) {
      const exists = db.team.some((m) => m.id === body.member.id);
      const perm = exists ? 'edit' : 'create';
      if (!hasModulePermission(user, 'teams', perm)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (exists) {
        db.team = db.team.map((m) =>
          m.id === body.member.id ? body.member : m
        );
      } else {
        db.team = [...db.team, body.member];
      }
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'teams',
        action: exists ? 'Updated team member profile' : 'Added team member',
        target: body.member.displayName,
      });
      writeDb(db);
    } else if (action === 'deleteTeamMember') {
      if (!hasModulePermission(user, 'teams', 'delete')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const target = db.team.find((m) => m.id === body.id);
      db.team = db.team.filter((m) => m.id !== body.id);
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'teams',
        action: 'Deleted team member profile',
        target: target?.displayName || body.id,
      });
      writeDb(db);
    }

    // ==========================================
    // MEDIA LIBRARY & WEBSITE IMAGES ACTIONS
    // ==========================================
    else if (action === 'updateMediaMeta' && body.asset) {
      if (!hasModulePermission(user, 'media', 'edit')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const existingAsset = db.media.find((m) => m.id === body.asset.id);
      const oldUrl = existingAsset?.url;
      const newUrl = body.asset.url;

      db.media = db.media.map((m) =>
        m.id === body.asset.id ? { ...m, ...body.asset } : m
      );

      // If URL changed, cascade to any references using oldUrl
      if (oldUrl && newUrl && oldUrl !== newUrl) {
        db.team = db.team.map((t) =>
          t.portraitUrl === oldUrl ? { ...t, portraitUrl: newUrl } : t
        );
        db.news = db.news.map((n) =>
          n.image === oldUrl ? { ...n, image: newUrl } : n
        );
        db.products = db.products.map((p) =>
          p.image === oldUrl ? { ...p, image: newUrl } : p
        );
        for (const k of Object.keys(db.siteImages) as Array<keyof typeof db.siteImages>) {
          if (db.siteImages[k] === oldUrl) {
            db.siteImages[k] = newUrl;
          }
        }
      }

      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'media',
        action: 'Updated media asset',
        target: body.asset.title,
      });
      writeDb(db);
    } else if (action === 'updateSiteImages' && body.siteImages) {
      if (!hasModulePermission(user, 'media', 'edit')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      db.siteImages = {
        ...db.siteImages,
        ...body.siteImages,
      };
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'media',
        action: 'Updated website content section images',
        target: body.sectionLabel || 'Public Website Visuals',
      });
      writeDb(db);
    } else if (action === 'deleteMedia') {
      if (!hasModulePermission(user, 'media', 'delete')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const target = db.media.find((m) => m.id === body.id);
      db.media = db.media.filter((m) => m.id !== body.id);
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'media',
        action: 'Deleted media asset',
        target: target?.title || body.id,
      });
      writeDb(db);
    }

    // ==========================================
    // ORBIT ASSISTANT ACTIONS
    // ==========================================
    else if (action === 'upsertOrbitFaq' && body.entry) {
      const exists = db.orbitFaqs.some((f) => f.id === body.entry.id);
      const perm = exists ? 'edit' : 'create';
      if (!hasModulePermission(user, 'orbit-assistant', perm)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (exists) {
        db.orbitFaqs = db.orbitFaqs.map((f) =>
          f.id === body.entry.id ? body.entry : f
        );
      } else {
        db.orbitFaqs = [body.entry, ...db.orbitFaqs];
      }
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'orbit-assistant',
        action: exists ? 'Updated Orbit FAQ entry' : 'Added Orbit FAQ entry',
        target: body.entry.title,
      });
      writeDb(db);
    } else if (action === 'deleteOrbitFaq') {
      if (!hasModulePermission(user, 'orbit-assistant', 'delete')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const target = db.orbitFaqs.find((f) => f.id === body.id);
      db.orbitFaqs = db.orbitFaqs.filter((f) => f.id !== body.id);
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'orbit-assistant',
        action: 'Deleted Orbit FAQ entry',
        target: target?.title || body.id,
      });
      writeDb(db);
    } else if (action === 'updateOrbitConfig' && body.config) {
      if (!hasModulePermission(user, 'orbit-assistant', 'edit')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      db.orbitConfig = { ...db.orbitConfig, ...body.config };
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'orbit-assistant',
        action: 'Updated Orbit Assistant & WhatsApp settings',
        target: db.orbitConfig.whatsappNumber,
      });
      writeDb(db);
    }

    // ==========================================
    // SEO MANAGEMENT ACTIONS
    // ==========================================
    else if (action === 'upsertSeo' && body.seoItem) {
      const exists = db.seo.some((s) => s.id === body.seoItem.id);
      const perm = exists ? 'edit' : 'create';
      if (!hasModulePermission(user, 'seo', perm)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (exists) {
        db.seo = db.seo.map((s) =>
          s.id === body.seoItem.id ? body.seoItem : s
        );
      } else {
        db.seo = [...db.seo, body.seoItem];
      }
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'seo',
        action: exists ? 'Updated route SEO metadata' : 'Added route SEO config',
        target: body.seoItem.route,
      });
      writeDb(db);
    } else if (action === 'deleteSeo') {
      if (!hasModulePermission(user, 'seo', 'delete')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const target = db.seo.find((s) => s.id === body.id);
      db.seo = db.seo.filter((s) => s.id !== body.id);
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'seo',
        action: 'Deleted route SEO config',
        target: target?.route || body.id,
      });
      writeDb(db);
    }

    // ==========================================
    // USER MANAGEMENT & RBAC SUB-MODULE ACTIONS
    // ==========================================
    else if (action === 'createUser' && body.userPayload) {
      if (!hasModulePermission(user, 'users', 'create')) {
        return NextResponse.json(
          { error: 'You do not have permission to create users.' },
          { status: 403 }
        );
      }
      const { fullName, email, password, roleId, department } =
        body.userPayload;
      const cleanEmail = String(email || '')
        .trim()
        .toLowerCase();

      if (!fullName || !cleanEmail || !password || password.length < 6) {
        return NextResponse.json(
          {
            error:
              'Full name, valid email, and password (min 6 characters) are required.',
          },
          { status: 400 }
        );
      }

      if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return NextResponse.json(
          { error: 'A user with that email address already exists.' },
          { status: 409 }
        );
      }

      const role =
        db.roles.find((r) => r.id === roleId) ||
        db.roles.find((r) => r.id === 'ROLE-TECH-MANAGER') ||
        db.roles[0];

      const now = new Date().toISOString();
      const newUser = {
        id: `USR-${Date.now().toString().slice(-6)}`,
        fullName: String(fullName).trim(),
        email: cleanEmail,
        passwordHash: hashPassword(password),
        roleId: role.id,
        roleName: role.name,
        status: 'active' as const,
        department: String(department || 'Operations & Administration').trim(),
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      };

      db.users.push(newUser);
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'users',
        action: `Created user with role ${role.name}`,
        target: `${newUser.fullName} (${newUser.email})`,
      });
      writeDb(db);
    } else if (action === 'updateUser' && body.userPayload) {
      if (!hasModulePermission(user, 'users', 'edit')) {
        return NextResponse.json(
          { error: 'You do not have permission to edit users.' },
          { status: 403 }
        );
      }
      const { id, fullName, email, roleId, department, status, newPassword } =
        body.userPayload;
      const targetUser = db.users.find((u) => u.id === id);
      if (!targetUser) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }

      // Protect against deactivating the last active Super Admin
      if (
        targetUser.roleId === 'ROLE-SUPER-ADMIN' &&
        (status === 'deactivated' ||
          (roleId && roleId !== 'ROLE-SUPER-ADMIN'))
      ) {
        const activeSuperAdmins = db.users.filter(
          (u) =>
            u.roleId === 'ROLE-SUPER-ADMIN' &&
            u.status === 'active' &&
            u.id !== targetUser.id
        );
        if (activeSuperAdmins.length === 0) {
          return NextResponse.json(
            {
              error:
                'Cannot deactivate or demote the last active Super Administrator.',
            },
            { status: 400 }
          );
        }
      }

      if (fullName) targetUser.fullName = String(fullName).trim();
      if (email) targetUser.email = String(email).trim().toLowerCase();
      if (department) targetUser.department = String(department).trim();
      if (status === 'active' || status === 'deactivated') {
        targetUser.status = status;
      }
      if (roleId) {
        const matchedRole = db.roles.find((r) => r.id === roleId);
        if (matchedRole) {
          targetUser.roleId = matchedRole.id;
          targetUser.roleName = matchedRole.name;
        }
      }
      if (newPassword && String(newPassword).length >= 6) {
        targetUser.passwordHash = hashPassword(String(newPassword));
      }
      targetUser.updatedAt = new Date().toISOString();

      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'users',
        action: `Updated user (${targetUser.status} · ${targetUser.roleName})`,
        target: `${targetUser.fullName} (${targetUser.email})`,
      });
      writeDb(db);
    } else if (action === 'deleteUser') {
      if (!hasModulePermission(user, 'users', 'delete')) {
        return NextResponse.json(
          { error: 'You do not have permission to delete users.' },
          { status: 403 }
        );
      }
      if (body.id === user.id) {
        return NextResponse.json(
          { error: 'You cannot delete your own active account.' },
          { status: 400 }
        );
      }
      const targetUser = db.users.find((u) => u.id === body.id);
      if (targetUser) {
        db.users = db.users.filter((u) => u.id !== body.id);
        appendAuditLog(db, {
          actorName: user.fullName,
          actorEmail: user.email,
          module: 'users',
          action: 'Deleted user account',
          target: `${targetUser.fullName} (${targetUser.email})`,
        });
        writeDb(db);
      }
    } else if (action === 'upsertRole' && body.role) {
      const exists = db.roles.some((r) => r.id === body.role.id);
      const perm = exists ? 'edit' : 'create';
      if (!hasModulePermission(user, 'users', perm)) {
        return NextResponse.json(
          { error: 'You do not have permission to manage roles.' },
          { status: 403 }
        );
      }
      const now = new Date().toISOString();
      if (exists) {
        db.roles = db.roles.map((r) =>
          r.id === body.role.id ? { ...r, ...body.role, updatedAt: now } : r
        );
        // Sync roleName on users with this roleId
        for (const u of db.users) {
          if (u.roleId === body.role.id) {
            u.roleName = body.role.name;
          }
        }
      } else {
        db.roles.push({
          ...body.role,
          isSystemRole: false,
          createdAt: now,
          updatedAt: now,
        });
      }
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'users',
        action: exists ? 'Updated RBAC role permissions' : 'Created RBAC role',
        target: body.role.name,
      });
      writeDb(db);
    } else if (action === 'deleteRole') {
      if (!hasModulePermission(user, 'users', 'delete')) {
        return NextResponse.json(
          { error: 'You do not have permission to delete roles.' },
          { status: 403 }
        );
      }
      const targetRole = db.roles.find((r) => r.id === body.id);
      if (!targetRole) {
        return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
      }
      if (targetRole.isSystemRole || targetRole.id === 'ROLE-SUPER-ADMIN') {
        return NextResponse.json(
          { error: 'System Super Administrator role cannot be deleted.' },
          { status: 400 }
        );
      }
      const assignedCount = db.users.filter(
        (u) => u.roleId === targetRole.id
      ).length;
      if (assignedCount > 0) {
        return NextResponse.json(
          {
            error: `Cannot delete role "${targetRole.name}" while ${assignedCount} user(s) are assigned to it.`,
          },
          { status: 400 }
        );
      }
      db.roles = db.roles.filter((r) => r.id !== body.id);
      appendAuditLog(db, {
        actorName: user.fullName,
        actorEmail: user.email,
        module: 'users',
        action: 'Deleted custom RBAC role',
        target: targetRole.name,
      });
      writeDb(db);
    }

    const updatedUser = getAuthenticatedUserFromRequest(req) || user;
    const reqDays = Number(body.days || 30);
    const days = [7, 30, 90, 365].includes(reqDays) ? reqDays : 30;
    const analytics = computeRealAnalyticsSummary(
      db.analyticsEvents,
      days,
      body.startDate && body.endDate
        ? { startDate: String(body.startDate), endDate: String(body.endDate) }
        : undefined
    );

    return NextResponse.json({
      ok: true,
      user: updatedUser,
      analytics,
      inquiries: db.inquiries,
      products: db.products,
      categories: db.categories,
      news: db.news,
      team: db.team,
      media: db.media,
      siteImages: db.siteImages,
      orbitFaqs: db.orbitFaqs,
      orbitConfig: db.orbitConfig,
      seo: db.seo,
      users: db.users.map(sanitizeUserForClient),
      roles: db.roles,
      supportTickets: db.supportTickets,
      auditLogs: db.auditLogs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server operation failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
