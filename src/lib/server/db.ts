import fs from 'fs';
import path from 'path';
import {
  AdminModuleId,
  AdminNewsPost,
  AdminRoleDefinition,
  AdminUserRecord,
  AnalyticsSummaryData,
  AuditLogEntry,
  ContactInquiryItem,
  MediaAssetItem,
  ModulePermissionAction,
  OrbitConfigRecord,
  ProductCategoryRecord,
  RolePermissionsMap,
  SeoPageConfig,
  SiteImagesConfig,
  SupportTicketRecord,
  VisitorCountryStat,
} from '@/types/admin';
import { ExecutiveMember, ProductItem } from '@/types';
import { OrbitKnowledgeEntry } from '@/lib/orbitAssistantEngine';
import { CATALOGUE_PRODUCTS } from '@/data/catalogueProducts';
import {
  NEWS_ARTICLES,
  NewsArticle,
  NewsArticleSection,
  NewsCategorySlug,
} from '@/data/newsData';
import { MANAGEMENT_TEAM } from '@/data/leadershipData';
import {
  COUNTRY_GEO_REGISTRY,
  INITIAL_MEDIA_LIBRARY,
  INITIAL_PRODUCT_CATEGORIES,
  INITIAL_SEO_CONFIGS,
} from '@/data/adminInitialData';
import orbitKnowledgeBaseRaw from '@/data/orbitKnowledgeBase.json';
import { hashPassword } from '@/lib/server/crypto';

export interface StoredAdminUser extends AdminUserRecord {
  passwordHash: string;
}

export interface PasswordResetTokenRecord {
  token: string;
  userId: string;
  email: string;
  expiresAt: number;
  used: boolean;
}

export interface AnalyticsEventRecord {
  id: string;
  timestamp: string;
  visitorHash: string;
  path: string;
  pageTitle: string;
  countryCode: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  referrerSource: string;
}

export interface ProductionDatabaseSchema {
  users: StoredAdminUser[];
  roles: AdminRoleDefinition[];
  passwordResetTokens: PasswordResetTokenRecord[];
  analyticsEvents: AnalyticsEventRecord[];
  inquiries: ContactInquiryItem[];
  products: ProductItem[];
  categories: ProductCategoryRecord[];
  news: AdminNewsPost[];
  team: ExecutiveMember[];
  media: MediaAssetItem[];
  siteImages: SiteImagesConfig;
  orbitFaqs: OrbitKnowledgeEntry[];
  orbitConfig: OrbitConfigRecord;
  seo: SeoPageConfig[];
  supportTickets: SupportTicketRecord[];
  auditLogs: AuditLogEntry[];
}

const ALL_MODULES: AdminModuleId[] = [
  'dashboard',
  'inbox',
  'news',
  'products',
  'teams',
  'media',
  'orbit-assistant',
  'seo',
  'users',
  'support',
];

function buildPermissions(
  modules: AdminModuleId[],
  actions: ModulePermissionAction[]
): RolePermissionsMap {
  const map = {} as RolePermissionsMap;
  for (const mod of ALL_MODULES) {
    map[mod] = modules.includes(mod) ? [...actions] : [];
  }
  return map;
}

function getDefaultRoles(): AdminRoleDefinition[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'ROLE-SUPER-ADMIN',
      name: 'Super Administrator',
      description:
        'Full administrative control across all modules, users, roles, permissions, and system configurations.',
      isSystemRole: true,
      permissions: buildPermissions(ALL_MODULES, [
        'view',
        'create',
        'edit',
        'delete',
      ]),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ROLE-TECH-MANAGER',
      name: 'Technical & Catalogue Manager',
      description:
        'Manages veterinary and poultry products, categories, news articles, leadership profiles, media, Orbit Assistant, and SEO.',
      isSystemRole: false,
      permissions: {
        dashboard: ['view'],
        inbox: ['view', 'edit'],
        news: ['view', 'create', 'edit', 'delete'],
        products: ['view', 'create', 'edit', 'delete'],
        teams: ['view', 'create', 'edit'],
        media: ['view', 'create', 'edit', 'delete'],
        'orbit-assistant': ['view', 'create', 'edit', 'delete'],
        seo: ['view', 'edit'],
        users: [],
        support: ['view', 'create'],
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ROLE-COMM-OFFICER',
      name: 'Communications & Support Officer',
      description:
        'Handles customer inquiries in Inbox, publishes company news updates, and manages chatbot FAQs.',
      isSystemRole: false,
      permissions: {
        dashboard: ['view'],
        inbox: ['view', 'create', 'edit'],
        news: ['view', 'create', 'edit'],
        products: ['view'],
        teams: ['view'],
        media: ['view', 'create'],
        'orbit-assistant': ['view', 'edit'],
        seo: ['view'],
        users: [],
        support: ['view', 'create'],
      },
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function getBootstrapUsers(): StoredAdminUser[] {
  const now = new Date().toISOString();
  const primaryEmail = (
    process.env.BOOTSTRAP_ADMIN_EMAIL ||
    process.env.SMTP_USER ||
    'technical_support@orbit.et'
  )
    .trim()
    .toLowerCase();

  const primaryPassword =
    process.env.BOOTSTRAP_ADMIN_PASSWORD ||
    process.env.SMTP_PASS ||
    'ChangeMeImmediately!';

  return [
    {
      id: 'USR-001',
      fullName: 'Technical & System Administrator',
      email: primaryEmail,
      passwordHash: hashPassword(primaryPassword),
      roleId: 'ROLE-SUPER-ADMIN',
      roleName: 'Super Administrator',
      status: 'active',
      department: 'Executive & Technical Administration',
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export const DEFAULT_SITE_IMAGES: SiteImagesConfig = {
  homeHeroImage: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
  homeAboutMainImage: '/images/hero/lijemrakel-about-final.jpg',
  homeAboutAccentImage: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
  aboutOfficeImage: '/images/hero/lijemrakel-about-final.jpg',
  strategyPhase1Image: '/images/strategy/phase-1.jpg',
  strategyPhase2Image: '/images/strategy/phase-2.jpg',
  strategyPhase3Image: '/images/strategy/phase-3.jpg',
  strategyPhase4Image: '/images/strategy/phase-4.jpg',
};

function labelToCategorySlug(
  label: AdminNewsPost['categoryLabel']
): NewsCategorySlug {
  if (label === 'Announcements') return 'announcements';
  if (label === 'Business Updates') return 'business-updates';
  return 'company-news';
}

function parseContentToSections(
  content: string,
  fallbackTitle: string
): NewsArticleSection[] {
  const trimmed = (content || '').trim();
  if (!trimmed) {
    return [
      {
        heading: fallbackTitle,
        paragraphs: ['Full update details from Lijemrakel Trading PLC.'],
      },
    ];
  }

  const blocks = trimmed.split(/^##\s+/m).filter(Boolean);
  if (blocks.length > 1 || trimmed.startsWith('## ')) {
    return blocks.map((block) => {
      const lines = block.split(/\r?\n/);
      const heading = lines[0]?.trim() || fallbackTitle;
      const body = lines.slice(1).join('\n').trim();
      const paragraphs = body
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      return {
        heading,
        paragraphs: paragraphs.length > 0 ? paragraphs : [body || fallbackTitle],
      };
    });
  }

  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return [
    {
      heading: 'Overview & Key Developments',
      paragraphs: paragraphs.length > 0 ? paragraphs : [trimmed],
    },
  ];
}

export function mapAdminNewsToPublicArticles(
  adminPosts: AdminNewsPost[],
  team: ExecutiveMember[]
): NewsArticle[] {
  const publishedPosts = adminPosts.filter((p) => p.status === 'Published');
  return publishedPosts.map((post, index) => {
    const staticMatch = NEWS_ARTICLES.find(
      (a) => a.id === post.id || a.slug === post.slug
    );
    const matchedAuthorMember = team.find(
      (m) =>
        m.displayName.toLowerCase() === (post.authorName || '').toLowerCase() ||
        m.name.toLowerCase() === (post.authorName || '').toLowerCase()
    );

    const parsedSections = post.content
      ? parseContentToSections(post.content, post.title)
      : staticMatch?.sections || [
          {
            heading: post.title,
            paragraphs: [post.excerpt],
          },
        ];

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      categorySlug: labelToCategorySlug(post.categoryLabel),
      categoryLabel: post.categoryLabel,
      date: post.date || staticMatch?.date || 'October 2026',
      readTime: staticMatch?.readTime || '4 min read',
      excerpt: post.excerpt,
      image:
        post.image ||
        staticMatch?.image ||
        '/images/hero/lijemrakel-hero-handshake.jpg',
      featured: index === 0,
      author: {
        name:
          post.authorName || staticMatch?.author.name || 'Dr Etsubdink Negash',
        role:
          post.authorRole ||
          matchedAuthorMember?.roleTitle ||
          staticMatch?.author.role ||
          'Executive Management',
        avatar:
          matchedAuthorMember?.portraitUrl ||
          staticMatch?.author.avatar ||
          '/images/leadership/leader-etsubdink.jpg',
      },
      keyTakeaways: staticMatch?.keyTakeaways || [
        post.excerpt,
        'Quality-assured veterinary and poultry supply chain across Ethiopia.',
        'Direct technical support from Lijemrakel Trading PLC specialists.',
      ],
      sections: parsedSections,
      quote: staticMatch?.quote || {
        text: post.excerpt,
        attribution: `${
          post.authorName || 'Executive Management'
        } — Lijemrakel Trading PLC`,
      },
      tags: staticMatch?.tags || [
        post.categoryLabel,
        'Lijemrakel Trading PLC',
        'Ethiopia',
      ],
    };
  });
}

function buildInitialDatabase(): ProductionDatabaseSchema {
  const initialNews: AdminNewsPost[] = NEWS_ARTICLES.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    categoryLabel: a.categoryLabel,
    status: 'Published',
    date: a.date,
    authorName: a.author.name,
    authorRole: a.author.role,
    excerpt: a.excerpt,
    content: a.sections
      .map((s) => `## ${s.heading}\n\n${s.paragraphs.join('\n\n')}`)
      .join('\n\n'),
    image: a.image,
  }));

  return {
    users: getBootstrapUsers(),
    roles: getDefaultRoles(),
    passwordResetTokens: [],
    analyticsEvents: [],
    inquiries: [],
    products: CATALOGUE_PRODUCTS,
    categories: INITIAL_PRODUCT_CATEGORIES,
    news: initialNews,
    team: MANAGEMENT_TEAM,
    media: INITIAL_MEDIA_LIBRARY,
    siteImages: { ...DEFAULT_SITE_IMAGES },
    orbitFaqs: orbitKnowledgeBaseRaw.entries as OrbitKnowledgeEntry[],
    orbitConfig: {
      assistantName: orbitKnowledgeBaseRaw.assistantMeta.name,
      welcomeMessage: orbitKnowledgeBaseRaw.assistantMeta.welcomeMessage,
      whatsappNumber: '0913514767',
      whatsappPrefilledMessage:
        "Hello, I'm contacting Lijemrakel Trading PLC. I'd like to know more about your products and services.",
      defaultSuggestions: orbitKnowledgeBaseRaw.assistantMeta.defaultSuggestions,
    },
    seo: INITIAL_SEO_CONFIGS,
    supportTickets: [],
    auditLogs: [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorName: 'System',
        actorEmail:
          process.env.BOOTSTRAP_ADMIN_EMAIL ||
          process.env.SMTP_USER ||
          'technical_support@orbit.et',
        module: 'auth',
        action: 'Production Database Initialized',
        target: 'RBAC Roles & Bootstrap Administrator',
      },
    ],
  };
}

let memoryFallbackDb: ProductionDatabaseSchema | null = null;
let cachedDbFilePath: string | null = null;
let cachedDefaults: ProductionDatabaseSchema | null = null;
let lastReadMtimeMs = 0;

function getDefaults(): ProductionDatabaseSchema {
  if (!cachedDefaults) {
    cachedDefaults = buildInitialDatabase();
  }
  return cachedDefaults;
}

export function resolveAppRootDir(): string {
  if (process.env.APP_ROOT_DIR) {
    return path.resolve(process.env.APP_ROOT_DIR);
  }
  const cwd = process.cwd();
  const normalized = cwd.replace(/\\/g, '/');
  if (normalized.endsWith('/.next/standalone')) {
    return path.resolve(cwd, '..', '..');
  }
  return cwd;
}

export function resolveUploadsDir(): string {
  if (process.env.UPLOADS_DIR) {
    return path.resolve(process.env.UPLOADS_DIR);
  }
  return path.join(resolveAppRootDir(), 'public', 'uploads');
}

function resolveDbFilePath(): string {
  if (cachedDbFilePath) {
    return cachedDbFilePath;
  }
  const primaryDir = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(resolveAppRootDir(), 'data');
  try {
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    const testFile = path.join(primaryDir, `.write-test-${process.pid}`);
    fs.writeFileSync(testFile, 'ok', 'utf8');
    fs.unlinkSync(testFile);
    cachedDbFilePath = path.join(primaryDir, 'production-db.json');
    return cachedDbFilePath;
  } catch {
    const tmpDir = '/tmp';
    cachedDbFilePath = path.join(tmpDir, 'lijemrakel-production-db.json');
    return cachedDbFilePath;
  }
}

export function readDb(): ProductionDatabaseSchema {
  try {
    const dbPath = resolveDbFilePath();
    const bakPath = `${dbPath}.bak`;
    const bundledDbPath = path.join(resolveAppRootDir(), 'data', 'production-db.json');
    if (!fs.existsSync(dbPath)) {
      if (fs.existsSync(bakPath)) {
        try {
          fs.copyFileSync(bakPath, dbPath);
        } catch {
          // ignore recovery copy failure
        }
      } else if (bundledDbPath !== dbPath && fs.existsSync(bundledDbPath)) {
        try {
          fs.copyFileSync(bundledDbPath, dbPath);
        } catch {
          // ignore bundled seed copy failure
        }
      }
    }
    if (!fs.existsSync(dbPath)) {
      if (bundledDbPath !== dbPath && fs.existsSync(bundledDbPath)) {
        try {
          const bundledRaw = fs.readFileSync(bundledDbPath, 'utf8');
          const bundledParsed = JSON.parse(bundledRaw) as ProductionDatabaseSchema;
          memoryFallbackDb = bundledParsed;
          return bundledParsed;
        } catch {
          // fall through to buildInitialDatabase
        }
      }
      const initial = buildInitialDatabase();
      writeDb(initial);
      memoryFallbackDb = initial;
      return initial;
    }

    const stat = fs.statSync(dbPath);
    if (memoryFallbackDb && stat.mtimeMs === lastReadMtimeMs) {
      return memoryFallbackDb;
    }

    let parsed: Partial<ProductionDatabaseSchema>;
    try {
      const raw = fs.readFileSync(dbPath, 'utf8');
      parsed = JSON.parse(raw) as Partial<ProductionDatabaseSchema>;
    } catch (parseErr) {
      if (fs.existsSync(bakPath)) {
        const bakRaw = fs.readFileSync(bakPath, 'utf8');
        parsed = JSON.parse(bakRaw) as Partial<ProductionDatabaseSchema>;
        try {
          fs.copyFileSync(bakPath, dbPath);
        } catch {
          // ignore restore failure
        }
      } else {
        throw parseErr;
      }
    }
    const defaults = getDefaults();

    const merged: ProductionDatabaseSchema = {
      users:
        Array.isArray(parsed.users) && parsed.users.length > 0
          ? parsed.users
          : defaults.users,
      roles:
        Array.isArray(parsed.roles) && parsed.roles.length > 0
          ? parsed.roles
          : defaults.roles,
      passwordResetTokens: Array.isArray(parsed.passwordResetTokens)
        ? parsed.passwordResetTokens
        : [],
      analyticsEvents: Array.isArray(parsed.analyticsEvents)
        ? parsed.analyticsEvents.filter(
            (e) =>
              !e.visitorHash?.startsWith('v_') && !/^EVT-\d{8}-/.test(e.id || '')
          )
        : [],
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      products: Array.isArray(parsed.products)
        ? parsed.products
        : defaults.products,
      categories: Array.isArray(parsed.categories)
        ? parsed.categories
        : defaults.categories,
      news: Array.isArray(parsed.news) ? parsed.news : defaults.news,
      team: Array.isArray(parsed.team) ? parsed.team : defaults.team,
      media: Array.isArray(parsed.media) ? parsed.media : defaults.media,
      siteImages: {
        ...DEFAULT_SITE_IMAGES,
        ...(parsed.siteImages || {}),
      },
      orbitFaqs: Array.isArray(parsed.orbitFaqs)
        ? parsed.orbitFaqs
        : defaults.orbitFaqs,
      orbitConfig: parsed.orbitConfig || defaults.orbitConfig,
      seo: Array.isArray(parsed.seo) ? parsed.seo : defaults.seo,
      supportTickets: Array.isArray(parsed.supportTickets)
        ? parsed.supportTickets
        : [],
      auditLogs: Array.isArray(parsed.auditLogs)
        ? parsed.auditLogs
        : defaults.auditLogs,
    };

    // Ensure bootstrap admin email from env exists and has current password if never logged in
    const envEmail = (
      process.env.BOOTSTRAP_ADMIN_EMAIL ||
      process.env.SMTP_USER ||
      'technical_support@orbit.et'
    )
      .trim()
      .toLowerCase();
    const hasBootstrap = merged.users.some(
      (u) => u.email.toLowerCase() === envEmail
    );
    if (!hasBootstrap) {
      merged.users.unshift(...defaults.users);
    }

    lastReadMtimeMs = stat.mtimeMs;
    memoryFallbackDb = merged;
    return merged;
  } catch {
    if (!memoryFallbackDb) {
      memoryFallbackDb = getDefaults();
    }
    return memoryFallbackDb;
  }
}

export function writeDb(data: ProductionDatabaseSchema): void {
  memoryFallbackDb = data;
  try {
    const dbPath = resolveDbFilePath();
    const serialized = JSON.stringify(data, null, 2);
    const tmpPath = `${dbPath}.tmp.${process.pid}.${Date.now()}`;
    const bakPath = `${dbPath}.bak`;
    fs.writeFileSync(tmpPath, serialized, 'utf8');
    if (fs.existsSync(dbPath)) {
      try {
        const currentStat = fs.statSync(dbPath);
        if (currentStat.size > 64) {
          fs.copyFileSync(dbPath, bakPath);
        }
      } catch {
        // ignore backup copy failure
      }
    }
    fs.renameSync(tmpPath, dbPath);
    try {
      lastReadMtimeMs = fs.statSync(dbPath).mtimeMs;
    } catch {
      lastReadMtimeMs = Date.now();
    }
  } catch {
    // Kept in memoryFallbackDb if filesystem write is restricted
  }
}

export function appendAuditLog(
  db: ProductionDatabaseSchema,
  entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
): void {
  const log: AuditLogEntry = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  db.auditLogs = [log, ...db.auditLogs.slice(0, 299)];
}

export function sanitizeUserForClient(user: StoredAdminUser): AdminUserRecord {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    roleId: user.roleId,
    roleName: user.roleName,
    status: user.status,
    department: user.department,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function normalizeTrafficSource(raw?: string): string {
  if (!raw) return 'Direct';
  const s = raw.trim();
  const lower = s.toLowerCase();
  if (lower === 'organic search' || lower.includes('google') || lower.includes('bing') || lower.includes('yahoo') || lower.includes('duckduckgo')) {
    return 'Organic Search';
  }
  if (lower === 'direct') {
    return 'Direct';
  }
  if (
    lower === 'social media' ||
    lower === 'social & messaging' ||
    lower.includes('whatsapp') ||
    lower.includes('facebook') ||
    lower.includes('linkedin') ||
    lower.includes('instagram') ||
    lower.includes('twitter') ||
    lower.includes('t.me') ||
    lower.includes('wa.me')
  ) {
    return 'Social Media';
  }
  if (lower === 'email' || lower.includes('mail') || lower.includes('newsletter') || lower.includes('outlook')) {
    return 'Email';
  }
  return 'Referral';
}

/**
 * Computes 100% real analytics statistics from recorded `analyticsEvents`.
 * Supports preset day windows (7, 30, 90, 365) and custom date ranges.
 */
export function computeRealAnalyticsSummary(
  events: AnalyticsEventRecord[],
  daysFilter = 30,
  customRange?: { startDate?: string; endDate?: string }
): AnalyticsSummaryData {
  const nowMs = Date.now();
  let endMs = nowMs;
  let startMs = nowMs - daysFilter * 24 * 60 * 60 * 1000;

  if (customRange?.startDate && customRange?.endDate) {
    const parsedStart = new Date(`${customRange.startDate}T00:00:00.000Z`).getTime();
    const parsedEnd = new Date(`${customRange.endDate}T23:59:59.999Z`).getTime();
    if (!Number.isNaN(parsedStart) && !Number.isNaN(parsedEnd) && parsedEnd >= parsedStart) {
      startMs = parsedStart;
      endMs = parsedEnd;
    }
  }

  const durationMs = Math.max(24 * 60 * 60 * 1000, endMs - startMs);
  const prevStartMs = startMs - durationMs;

  const filtered = events.filter((e) => {
    const ts = new Date(e.timestamp).getTime();
    return !Number.isNaN(ts) && ts >= startMs && ts <= endMs;
  });

  const prevFiltered = events.filter((e) => {
    const ts = new Date(e.timestamp).getTime();
    return !Number.isNaN(ts) && ts >= prevStartMs && ts < startMs;
  });

  const totalPageViews = filtered.length;
  const prevTotalPageViews = prevFiltered.length;
  const uniqueVisitorSet = new Set(filtered.map((e) => e.visitorHash));
  const uniqueVisitors = uniqueVisitorSet.size;
  const prevUniqueVisitors = new Set(prevFiltered.map((e) => e.visitorHash)).size;

  const visitorsChangePct =
    prevUniqueVisitors > 0
      ? Number((((uniqueVisitors - prevUniqueVisitors) / prevUniqueVisitors) * 100).toFixed(1))
      : uniqueVisitors > 0
      ? 100
      : 0;

  const pageViewsChangePct =
    prevTotalPageViews > 0
      ? Number((((totalPageViews - prevTotalPageViews) / prevTotalPageViews) * 100).toFixed(1))
      : totalPageViews > 0
      ? 100
      : 0;

  const startDateObj = new Date(startMs);
  const endDateObj = new Date(endMs);
  const periodStart = startDateObj.toISOString().slice(0, 10);
  const periodEnd = endDateObj.toISOString().slice(0, 10);
  const periodLabel = `${startDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} – ${endDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;

  // Group by country
  const countryMap = new Map<
    string,
    { visitors: Set<string>; pageViews: number }
  >();
  for (const ev of filtered) {
    const code = (ev.countryCode || 'ET').toUpperCase();
    const existing = countryMap.get(code) || {
      visitors: new Set<string>(),
      pageViews: 0,
    };
    existing.visitors.add(ev.visitorHash);
    existing.pageViews += 1;
    countryMap.set(code, existing);
  }

  const totalCountryVisitors = Array.from(countryMap.values()).reduce(
    (sum, item) => sum + item.visitors.size,
    0
  );

  const countryStats: VisitorCountryStat[] = Array.from(countryMap.entries())
    .map(([code, data]) => {
      const geo = COUNTRY_GEO_REGISTRY[code] || {
        countryName: code,
        region: 'International',
        coordinates: { x: 540, y: 220 },
      };
      const visitorShare =
        totalCountryVisitors > 0
          ? Number(((data.visitors.size / totalCountryVisitors) * 100).toFixed(1))
          : 0;
      const trafficShare =
        totalPageViews > 0
          ? Number(((data.pageViews / totalPageViews) * 100).toFixed(1))
          : 0;
      return {
        countryCode: code,
        countryName: geo.countryName,
        region: geo.region,
        visitors: data.visitors.size,
        pageViews: data.pageViews,
        visitorShare,
        trafficShare,
        coordinates: geo.coordinates,
      };
    })
    .sort((a, b) => b.visitors - a.visitors || b.pageViews - a.pageViews);

  // Daily traffic buckets across the selected time period
  const totalDays = Math.max(1, Math.round(durationMs / (24 * 60 * 60 * 1000)));
  const dailyTraffic: AnalyticsSummaryData['dailyTraffic'] = [];

  if (totalDays <= 35) {
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(endMs - i * 24 * 60 * 60 * 1000);
      const dayKey = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const dayEvents = filtered.filter((e) => e.timestamp.startsWith(dayKey));
      const dayVisitors = new Set(dayEvents.map((e) => e.visitorHash)).size;
      dailyTraffic.push({
        date: dayKey,
        label,
        visitors: dayVisitors,
        pageViews: dayEvents.length,
      });
    }
  } else {
    // Group into ~30 buckets for 90d or 365d ranges
    const bucketCount = 30;
    const stepMs = durationMs / bucketCount;
    for (let b = 0; b < bucketCount; b++) {
      const bStart = startMs + b * stepMs;
      const bEnd = b === bucketCount - 1 ? endMs + 1 : startMs + (b + 1) * stepMs;
      const d = new Date(bEnd);
      const dayKey = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const bucketEvents = filtered.filter((e) => {
        const ts = new Date(e.timestamp).getTime();
        return ts >= bStart && ts < bEnd;
      });
      const bucketVisitors = new Set(bucketEvents.map((e) => e.visitorHash)).size;
      dailyTraffic.push({
        date: dayKey,
        label,
        visitors: bucketVisitors,
        pageViews: bucketEvents.length,
      });
    }
  }

  // Popular pages
  const pageMap = new Map<
    string,
    { title: string; views: number; visitors: Set<string> }
  >();
  for (const ev of filtered) {
    const cur = pageMap.get(ev.path) || {
      title: ev.pageTitle || ev.path,
      views: 0,
      visitors: new Set<string>(),
    };
    cur.views += 1;
    cur.visitors.add(ev.visitorHash);
    pageMap.set(ev.path, cur);
  }
  const popularPages = Array.from(pageMap.entries())
    .map(([p, info]) => ({
      path: p,
      title: info.title,
      views: info.views,
      visitors: info.visitors.size,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  // Device Breakdown (Mobile, Desktop, Tablet)
  const deviceStats: Record<
    'Mobile' | 'Desktop' | 'Tablet',
    { count: number; visitors: Set<string> }
  > = {
    Mobile: { count: 0, visitors: new Set() },
    Desktop: { count: 0, visitors: new Set() },
    Tablet: { count: 0, visitors: new Set() },
  };
  for (const ev of filtered) {
    const dev =
      ev.deviceType === 'Mobile' || ev.deviceType === 'Tablet'
        ? ev.deviceType
        : 'Desktop';
    deviceStats[dev].count += 1;
    deviceStats[dev].visitors.add(ev.visitorHash);
  }
  const deviceBreakdown: AnalyticsSummaryData['deviceBreakdown'] = (
    ['Mobile', 'Desktop', 'Tablet'] as const
  ).map((device) => ({
    device,
    count: deviceStats[device].count,
    visitors: deviceStats[device].visitors.size,
    percentage:
      totalPageViews > 0
        ? Number(((deviceStats[device].count / totalPageViews) * 100).toFixed(1))
        : 0,
  }));

  // Traffic Sources (Canonical 5 channels)
  const canonicalSources = [
    'Organic Search',
    'Direct',
    'Social Media',
    'Referral',
    'Email',
  ];
  const sourceMap = new Map<
    string,
    { count: number; visitors: Set<string> }
  >();
  for (const src of canonicalSources) {
    sourceMap.set(src, { count: 0, visitors: new Set() });
  }
  for (const ev of filtered) {
    const normalized = normalizeTrafficSource(ev.referrerSource);
    const cur = sourceMap.get(normalized) || {
      count: 0,
      visitors: new Set<string>(),
    };
    cur.count += 1;
    cur.visitors.add(ev.visitorHash);
    sourceMap.set(normalized, cur);
  }

  const trafficSources = Array.from(sourceMap.entries())
    .map(([source, data]) => ({
      source,
      count: data.count,
      visitors: data.visitors.size,
      share:
        totalPageViews > 0
          ? Number(((data.count / totalPageViews) * 100).toFixed(1))
          : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalPageViews,
    prevTotalPageViews,
    pageViewsChangePct,
    uniqueVisitors,
    prevUniqueVisitors,
    visitorsChangePct,
    countriesReached: countryStats.length,
    periodStart,
    periodEnd,
    periodLabel,
    countryStats,
    dailyTraffic,
    popularPages,
    deviceBreakdown,
    trafficSources,
  };
}
