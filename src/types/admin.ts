export type AdminModuleId =
  | 'dashboard'
  | 'inbox'
  | 'news'
  | 'products'
  | 'teams'
  | 'media'
  | 'orbit-assistant'
  | 'seo'
  | 'users'
  | 'support';

export type ModulePermissionAction = 'view' | 'create' | 'edit' | 'delete';

export type RolePermissionsMap = Record<AdminModuleId, ModulePermissionAction[]>;

export interface AdminRoleDefinition {
  id: string;
  name: string;
  description: string;
  isSystemRole?: boolean;
  permissions: RolePermissionsMap;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserRecord {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
  roleName: string;
  status: 'active' | 'deactivated';
  department: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedAdminUser {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
  roleName: string;
  status: 'active' | 'deactivated';
  department: string;
  permissions: RolePermissionsMap;
  lastLoginAt: string | null;
}

export interface InquiryReplyRecord {
  id: string;
  sentAt: string;
  sentByEmail: string;
  sentByName: string;
  toEmail: string;
  subject: string;
  body: string;
  messageId?: string;
}

export interface ContactInquiryItem {
  id: string;
  senderName: string;
  organization: string;
  email: string;
  phone: string;
  country: string;
  inquiryType:
    | 'Product Inquiry'
    | 'Supplier Partnership'
    | 'Poultry & Hatchery'
    | 'General Business';
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  assignedDepartment: string;
  replies: InquiryReplyRecord[];
}

export interface VisitorCountryStat {
  countryCode: string;
  countryName: string;
  region: string;
  visitors: number;
  pageViews: number;
  /** Percentage of total visitors (0..100, 1 decimal) */
  visitorShare: number;
  /** Percentage of total page views (0..100, 1 decimal) */
  trafficShare: number;
  coordinates: {
    /** Normalized SVG map coordinates (x: 0..1000, y: 0..500) */
    x: number;
    y: number;
  };
}

export interface AnalyticsSummaryData {
  totalPageViews: number;
  prevTotalPageViews: number;
  pageViewsChangePct: number;
  uniqueVisitors: number;
  prevUniqueVisitors: number;
  visitorsChangePct: number;
  countriesReached: number;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  countryStats: VisitorCountryStat[];
  dailyTraffic: {
    date: string;
    label: string;
    visitors: number;
    pageViews: number;
  }[];
  popularPages: {
    path: string;
    title: string;
    views: number;
    visitors?: number;
  }[];
  deviceBreakdown: {
    device: 'Mobile' | 'Desktop' | 'Tablet';
    count: number;
    visitors: number;
    percentage: number;
  }[];
  trafficSources: {
    source: string;
    count: number;
    visitors: number;
    share: number;
  }[];
}

export interface ProductCategoryRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  subcategories: string[];
  status: 'Active' | 'Planned';
  createdAt: string;
}

export interface MediaAssetItem {
  id: string;
  title: string;
  fileName: string;
  url: string;
  category:
    | 'Logo & Brand'
    | 'Hero & Office'
    | 'Leadership'
    | 'Strategy'
    | 'Products'
    | 'Document';
  fileType: string;
  sizeBytes?: number;
  dimensions: string;
  uploadedAt: string;
  uploadedBy?: string;
  altText: string;
}

export interface SeoPageConfig {
  id: string;
  route: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  indexStatus: 'index, follow' | 'noindex, nofollow';
  lastUpdated: string;
}

export interface AdminNewsPost {
  id: string;
  slug: string;
  title: string;
  categoryLabel: 'Company News' | 'Announcements' | 'Business Updates';
  status: 'Published' | 'Scheduled' | 'Draft';
  scheduledFor?: string;
  date: string;
  authorName: string;
  authorRole?: string;
  excerpt: string;
  content: string;
  image: string;
}

export interface SupportTicketRecord {
  id: string;
  subject: string;
  category:
    | 'Technical Issue'
    | 'Email / SMTP Configuration'
    | 'Hosting & Domain'
    | 'Feature Request'
    | 'Security & Access'
    | 'General Support';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  message: string;
  contactEmail: string;
  contactPhone: string;
  submittedByName: string;
  submittedByEmail: string;
  recipientEmail: string;
  status: 'Sent to Orbit Support' | 'Delivery Failed';
  smtpMessageId?: string;
  errorDetail?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  module: AdminModuleId | 'auth';
  action: string;
  target: string;
  ipAddress?: string;
}

export interface OrbitConfigRecord {
  assistantName: string;
  welcomeMessage: string;
  whatsappNumber: string;
  whatsappPrefilledMessage: string;
  defaultSuggestions: string[];
}

export interface SiteImagesConfig {
  homeHeroImage: string;
  homeAboutMainImage: string;
  homeAboutAccentImage: string;
  aboutOfficeImage: string;
  strategyPhase1Image: string;
  strategyPhase2Image: string;
  strategyPhase3Image: string;
  strategyPhase4Image: string;
}

