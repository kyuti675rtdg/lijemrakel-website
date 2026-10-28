'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Newspaper,
  Package,
  Users,
  Image as ImageIcon,
  Bot,
  Search as SearchIcon,
  ShieldCheck,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  Send,
  Upload,
  Copy,
  Check,
  X,
  Eye,
  Clock,
  Globe2,
  FolderKanban,
  Activity,
  Menu,
  Bell,
  ChevronDown,
} from 'lucide-react';
import {
  AdminModuleId,
  AdminNewsPost,
  AdminRoleDefinition,
  AdminUserRecord,
  AnalyticsSummaryData,
  AuditLogEntry,
  AuthenticatedAdminUser,
  ContactInquiryItem,
  MediaAssetItem,
  ModulePermissionAction,
  OrbitConfigRecord,
  ProductCategoryRecord,
  SeoPageConfig,
  SiteImagesConfig,
  SupportTicketRecord,
} from '@/types/admin';
import { ImageUploadPicker } from '@/components/admin/ImageUploadPicker';
import { INITIAL_SITE_IMAGES } from '@/lib/usePublicCms';
import {
  ExecutiveMember,
  ProductItem,
  VetMedSubcategory,
} from '@/types';
import {
  OrbitKnowledgeEntry,
  ORBIT_ADMIN_KB_STORAGE_KEY,
} from '@/lib/orbitAssistantEngine';
import {
  AnalyticsDaysRange,
  CountryFlag,
} from '@/components/admin/GlobalVisitorMap';
import { DashboardOverviewSection } from '@/components/admin/DashboardOverviewSection';
import {
  SupportDeskModule,
  UserManagementModule,
} from '@/components/admin/UserAndSupportModules';
import { SmtpConfigStatus } from '@/lib/server/mailer';

interface SidebarItem {
  id: AdminModuleId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_MODULES: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'teams', label: 'Teams', icon: Users },
  { id: 'media', label: 'Media Library', icon: ImageIcon },
  { id: 'orbit-assistant', label: 'Orbit Assistant', icon: Bot },
  { id: 'seo', label: 'SEO Management', icon: SearchIcon },
  { id: 'users', label: 'User Management', icon: ShieldCheck },
  { id: 'support', label: 'Support', icon: LifeBuoy },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] =
    useState<AuthenticatedAdminUser | null>(null);
  const [activeModule, setActiveModule] = useState<AdminModuleId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Store State
  const [analytics, setAnalytics] = useState<AnalyticsSummaryData>({
    totalPageViews: 0,
    prevTotalPageViews: 0,
    pageViewsChangePct: 0,
    uniqueVisitors: 0,
    prevUniqueVisitors: 0,
    visitorsChangePct: 0,
    countriesReached: 0,
    periodStart: '',
    periodEnd: '',
    periodLabel: 'Last 30 Days',
    countryStats: [],
    dailyTraffic: [],
    popularPages: [],
    deviceBreakdown: [],
    trafficSources: [],
  });
  const [selectedDays, setSelectedDays] = useState<AnalyticsDaysRange>(30);
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'EN' | 'AM'>('EN');
  const [smtpStatus, setSmtpStatus] = useState<SmtpConfigStatus | null>(null);
  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<ProductCategoryRecord[]>([]);
  const [newsList, setNewsList] = useState<AdminNewsPost[]>([]);
  const [teamList, setTeamList] = useState<ExecutiveMember[]>([]);
  const [mediaList, setMediaList] = useState<MediaAssetItem[]>([]);
  const [siteImages, setSiteImages] =
    useState<SiteImagesConfig>(INITIAL_SITE_IMAGES);
  const [orbitFaqs, setOrbitFaqs] = useState<OrbitKnowledgeEntry[]>([]);
  const [orbitConfig, setOrbitConfig] = useState<OrbitConfigRecord>({
    assistantName: 'Orbit Assistant',
    welcomeMessage: '',
    whatsappNumber: '0913514767',
    whatsappPrefilledMessage:
      "Hello, I'm contacting Lijemrakel Trading PLC. I'd like to know more about your products and services.",
    defaultSuggestions: [],
  });
  const [seoList, setSeoList] = useState<SeoPageConfig[]>([]);
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [rolesList, setRolesList] = useState<AdminRoleDefinition[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicketRecord[]>(
    []
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Notification Toast & Confirmation Modal
  const [toast, setToast] = useState<{
    message: string;
    isError?: boolean;
  } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    label: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Load authenticated admin store
  const fetchStoreData = async (
    days: AnalyticsDaysRange = selectedDays,
    range: { startDate: string; endDate: string } | null = customDateRange
  ) => {
    try {
      const params = new URLSearchParams({ days: String(days) });
      if (range?.startDate && range?.endDate) {
        params.set('startDate', range.startDate);
        params.set('endDate', range.endDate);
      }
      const res = await fetch(`/api/admin/store?${params.toString()}`, {
        cache: 'no-store',
      });
      if (res.status === 401) {
        router.replace('/adminlogin');
        return;
      }
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
      if (data.analytics) setAnalytics(data.analytics);
      if (data.smtpStatus) setSmtpStatus(data.smtpStatus);
      if (Array.isArray(data.inquiries)) setInquiries(data.inquiries);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.news)) setNewsList(data.news);
      if (Array.isArray(data.team)) setTeamList(data.team);
      if (Array.isArray(data.media)) setMediaList(data.media);
      if (data.siteImages) {
        setSiteImages({ ...INITIAL_SITE_IMAGES, ...data.siteImages });
      }
      if (Array.isArray(data.orbitFaqs)) setOrbitFaqs(data.orbitFaqs);
      if (data.orbitConfig) setOrbitConfig(data.orbitConfig);
      if (Array.isArray(data.seo)) setSeoList(data.seo);
      if (Array.isArray(data.users)) setUsersList(data.users);
      if (Array.isArray(data.roles)) setRolesList(data.roles);
      if (Array.isArray(data.supportTickets))
        setSupportTickets(data.supportTickets);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData(selectedDays, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time live polling & window focus refresh for current website analytics and CMS activity
  useEffect(() => {
    if (activeModule !== 'dashboard') return;

    const interval = setInterval(() => {
      fetchStoreData(selectedDays, customDateRange);
    }, 6000);

    const handleFocus = () => {
      fetchStoreData(selectedDays, customDateRange);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModule, selectedDays, customDateRange]);

  const handleSelectAnalyticsDays = (days: AnalyticsDaysRange) => {
    setSelectedDays(days);
    setCustomDateRange(null);
    fetchStoreData(days, null);
  };

  const handleApplyCustomDateRange = (startDate: string, endDate: string) => {
    const nextRange = { startDate, endDate };
    setCustomDateRange(nextRange);
    fetchStoreData(selectedDays, nextRange);
  };

  const canDo = (
    mod: AdminModuleId,
    action: ModulePermissionAction
  ): boolean => {
    if (!currentUser) return false;
    if (currentUser.roleId === 'ROLE-SUPER-ADMIN') return true;
    return Boolean(currentUser.permissions?.[mod]?.includes(action));
  };

  const dispatchStoreMutation = async (
    action: string,
    payload: Record<string, unknown>
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          days: selectedDays,
          ...(customDateRange || {}),
          ...payload,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'Operation failed.' };
      }

      if (data.user) setCurrentUser(data.user);
      if (data.analytics) setAnalytics(data.analytics);
      if (Array.isArray(data.inquiries)) setInquiries(data.inquiries);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.news)) setNewsList(data.news);
      if (Array.isArray(data.team)) setTeamList(data.team);
      if (Array.isArray(data.media)) setMediaList(data.media);
      if (data.siteImages) {
        setSiteImages({ ...INITIAL_SITE_IMAGES, ...data.siteImages });
      }
      if (Array.isArray(data.orbitFaqs)) {
        setOrbitFaqs(data.orbitFaqs);
        try {
          localStorage.setItem(
            ORBIT_ADMIN_KB_STORAGE_KEY,
            JSON.stringify(data.orbitFaqs)
          );
        } catch {
          // Ignore storage error
        }
      }
      if (data.orbitConfig) setOrbitConfig(data.orbitConfig);
      if (Array.isArray(data.seo)) setSeoList(data.seo);
      if (Array.isArray(data.users)) setUsersList(data.users);
      if (Array.isArray(data.roles)) setRolesList(data.roles);
      if (Array.isArray(data.supportTickets))
        setSupportTickets(data.supportTickets);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error while saving changes.' };
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/adminlogin');
  };

  // ==========================================
  // MODULE 2: INBOX STATE & SMTP REPLY
  // ==========================================
  const [inboxFilter, setInboxFilter] = useState<string>('all');
  const [inboxSearch, setInboxSearch] = useState('');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    null
  );
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((i) => {
      if (inboxFilter !== 'all' && i.status !== inboxFilter) return false;
      const q = inboxSearch.toLowerCase();
      return (
        !q ||
        i.senderName.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.subject.toLowerCase().includes(q) ||
        i.organization.toLowerCase().includes(q)
      );
    });
  }, [inquiries, inboxFilter, inboxSearch]);

  const activeInquiry =
    inquiries.find((i) => i.id === selectedInquiryId) ||
    filteredInquiries[0] ||
    null;

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiry) return;
    if (!replyBody.trim()) {
      showToast('Please write a reply message before sending.', true);
      return;
    }

    setSendingReply(true);
    try {
      const res = await fetch('/api/admin/email/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: activeInquiry.id,
          subject: replySubject.trim() || `Re: ${activeInquiry.subject}`,
          body: replyBody.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to send email reply.', true);
        setSendingReply(false);
        return;
      }

      if (Array.isArray(data.inquiries)) setInquiries(data.inquiries);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      setReplyBody('');
      showToast(`Email reply sent to ${activeInquiry.email} via SMTP.`);
    } catch {
      showToast('Network error while sending SMTP reply.', true);
    } finally {
      setSendingReply(false);
    }
  };

  // ==========================================
  // MODULE 3: NEWS STATE
  // ==========================================
  const [newsSearch, setNewsSearch] = useState('');
  const [newsStatusFilter, setNewsStatusFilter] = useState<string>('all');
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<AdminNewsPost | null>(null);
  const [previewNews, setPreviewNews] = useState<AdminNewsPost | null>(null);

  const openNewArticleModal = () => {
    setEditingNews({
      id: `NEWS-${Date.now().toString().slice(-5)}`,
      slug: '',
      title: '',
      categoryLabel: 'Company News',
      status: 'Published',
      scheduledFor: '',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      authorName: currentUser?.fullName || 'Dr Etsubdink Negash',
      authorRole: 'General & Technical Manager',
      excerpt: '',
      content: '',
      image: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
    });
    setNewsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editingNews.title.trim()) {
      showToast('Article title is required.', true);
      return;
    }
    const slug =
      editingNews.slug.trim() ||
      editingNews.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const res = await dispatchStoreMutation('upsertNews', {
      article: { ...editingNews, slug },
    });
    if (!res.ok) {
      showToast(res.error || 'Failed to save article.', true);
      return;
    }
    setNewsModalOpen(false);
    showToast('News article saved.');
  };

  // ==========================================
  // MODULE 4: PRODUCTS & CATEGORIES STATE
  // ==========================================
  const [productSubTab, setProductSubTab] = useState<'products' | 'categories'>(
    'products'
  );
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] =
    useState<string>('all');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(
    null
  );

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategoryRecord | null>(null);
  const [subcatInput, setSubcatInput] = useState('');

  const openNewProductModal = () => {
    const firstCat = categories[0] || {
      slug: 'veterinary-medicines',
      name: 'Veterinary Medicines',
      subcategories: ['General'],
    };
    setEditingProduct({
      id: `PRD-${Date.now().toString().slice(-5)}`,
      slug: '',
      name: '',
      categorySlug: firstCat.slug as ProductItem['categorySlug'],
      categoryName: firstCat.name,
      subcategory: (firstCat.subcategories[0] ||
        'Anthelmintics (dewormers)') as VetMedSubcategory,
      classification: 'Veterinary Medicine',
      activeIngredientOrComposition: '',
      dosageForm: '',
      packSize: '',
      intendedSpecies: ['Cattle', 'Poultry'],
      approvedIndicationsSummary: '',
      storageConditions: 'Store below 25°C in a dry place.',
      coldChainRequired: false,
      withdrawalPeriodNote:
        'Observe species-specific withdrawal intervals per approved label.',
      manufacturerStatus: 'International GMP Veterinary Manufacturer',
      authorizationStatusNote:
        'Supplied in accordance with national veterinary registration',
      stewardshipWarning:
        'Use strictly according to approved product labeling.',
      verificationStatus: 'registered-verified',
      image: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
      imageCaption: 'Veterinary product profile.',
      featured: false,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) {
      showToast('Product name is required.', true);
      return;
    }
    const slug =
      editingProduct.slug.trim() ||
      editingProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const matchedCat = categories.find(
      (c) => c.slug === editingProduct.categorySlug
    );
    const res = await dispatchStoreMutation('upsertProduct', {
      product: {
        ...editingProduct,
        slug,
        categoryName: matchedCat?.name || editingProduct.categoryName,
      },
    });
    if (!res.ok) {
      showToast(res.error || 'Could not save product.', true);
      return;
    }
    setProductModalOpen(false);
    showToast('Product saved.');
  };

  const openNewCategoryModal = () => {
    setEditingCategory({
      id: `CAT-${Date.now().toString().slice(-4)}`,
      slug: '',
      name: '',
      description: '',
      subcategories: [],
      status: 'Active',
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setSubcatInput('');
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) {
      showToast('Category name is required.', true);
      return;
    }
    const slug =
      editingCategory.slug.trim() ||
      editingCategory.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const subcats = subcatInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await dispatchStoreMutation('upsertCategory', {
      category: {
        ...editingCategory,
        slug,
        subcategories: subcats,
      },
    });
    if (!res.ok) {
      showToast(res.error || 'Failed to save category.', true);
      return;
    }
    setCategoryModalOpen(false);
    showToast('Product category saved.');
  };

  // ==========================================
  // MODULE 5: TEAMS STATE
  // ==========================================
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ExecutiveMember | null>(
    null
  );
  const [respText, setRespText] = useState('');

  const openNewMemberModal = () => {
    setEditingMember({
      id: `leader-${Date.now().toString().slice(-4)}`,
      name: '',
      formalTitlePrefix: 'Mr',
      displayName: '',
      initials: '',
      roleTitle: '',
      department: 'Executive Management',
      isFoundingMember: false,
      isProposedBoardMember: false,
      isManagementTeam: true,
      summary: '',
      responsibilities: [],
      portraitUrl: '/images/leadership/leader-lijalem.jpg',
      portraitNote: '',
    });
    setRespText('');
    setTeamModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name.trim()) {
      showToast('Leader name is required.', true);
      return;
    }
    const initials =
      editingMember.initials.trim() ||
      editingMember.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    const displayName =
      editingMember.displayName.trim() ||
      `${editingMember.formalTitlePrefix} ${editingMember.name}`.trim();
    const responsibilities = respText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const res = await dispatchStoreMutation('upsertTeamMember', {
      member: {
        ...editingMember,
        initials,
        displayName,
        responsibilities,
      },
    });
    if (!res.ok) {
      showToast(res.error || 'Failed to save team member.', true);
      return;
    }
    setTeamModalOpen(false);
    showToast('Team profile saved.');
  };

  // ==========================================
  // MODULE 6: MEDIA LIBRARY & REAL UPLOAD
  // ==========================================
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [mediaSubTab, setMediaSubTab] = useState<'library' | 'site-images'>(
    'library'
  );
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('all');
  const [mediaSearch, setMediaSearch] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(
    null
  );
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] =
    useState<MediaAssetItem['category']>('Hero & Office');
  const [uploadAltText, setUploadAltText] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);
  const [editingMediaAsset, setEditingMediaAsset] =
    useState<MediaAssetItem | null>(null);
  const [replacingMediaFile, setReplacingMediaFile] = useState<File | null>(
    null
  );
  const [savingSiteImages, setSavingSiteImages] = useState(false);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUploadFile) {
      showToast('Please select a file from your computer.', true);
      return;
    }
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedUploadFile);
      formData.append('title', uploadTitle.trim());
      formData.append('category', uploadCategory);
      formData.append('altText', uploadAltText.trim());

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'File upload failed.', true);
        setUploadingFile(false);
        return;
      }

      if (Array.isArray(data.media)) setMediaList(data.media);
      if (data.siteImages)
        setSiteImages({ ...INITIAL_SITE_IMAGES, ...data.siteImages });
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      setUploadModalOpen(false);
      setSelectedUploadFile(null);
      setUploadTitle('');
      setUploadAltText('');
      showToast(`Uploaded ${data.asset?.fileName} to Media Library.`);
    } catch {
      showToast('Network error during file upload.', true);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveEditedMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMediaAsset) return;
    setUploadingFile(true);

    try {
      if (replacingMediaFile) {
        const formData = new FormData();
        formData.append('file', replacingMediaFile);
        formData.append('replaceAssetId', editingMediaAsset.id);
        formData.append('title', editingMediaAsset.title.trim());
        formData.append('category', editingMediaAsset.category);
        formData.append('altText', editingMediaAsset.altText.trim());

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          showToast(data.error || 'Failed to replace media file.', true);
          setUploadingFile(false);
          return;
        }
        if (Array.isArray(data.media)) setMediaList(data.media);
        if (Array.isArray(data.team)) setTeamList(data.team);
        if (Array.isArray(data.news)) setNewsList(data.news);
        if (Array.isArray(data.products)) setProducts(data.products);
        if (data.siteImages)
          setSiteImages({ ...INITIAL_SITE_IMAGES, ...data.siteImages });
        if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
        setEditingMediaAsset(null);
        setReplacingMediaFile(null);
        showToast('Media file replaced and synced across website.');
      } else {
        const res = await dispatchStoreMutation('updateMediaMeta', {
          asset: editingMediaAsset,
        });
        if (!res.ok) {
          showToast(res.error || 'Failed to update media details.', true);
          setUploadingFile(false);
          return;
        }
        setEditingMediaAsset(null);
        showToast('Media details updated.');
      }
    } catch {
      showToast('Network error while updating media.', true);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveSiteImages = async (
    nextSiteImages: SiteImagesConfig = siteImages,
    sectionLabel = 'Public Website Visuals'
  ) => {
    setSavingSiteImages(true);
    const res = await dispatchStoreMutation('updateSiteImages', {
      siteImages: nextSiteImages,
      sectionLabel,
    });
    setSavingSiteImages(false);
    if (!res.ok) {
      showToast(res.error || 'Could not save website photos.', true);
      return;
    }
    showToast(`Saved ${sectionLabel} and updated public website.`);
  };

  // ==========================================
  // MODULE 7: ORBIT ASSISTANT & WHATSAPP
  // ==========================================
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<OrbitKnowledgeEntry | null>(
    null
  );
  const [faqKeywordsText, setFaqKeywordsText] = useState('');

  const openNewFaqModal = () => {
    setEditingFaq({
      id: `faq-${Date.now().toString().slice(-5)}`,
      category: 'general',
      title: '',
      keywords: [],
      answer: '',
      links: [{ label: 'Contact Us', href: '/contact' }],
      suggestions: ['What products do you supply?', 'Contact Lijemrakel'],
    });
    setFaqKeywordsText('');
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.title.trim() || !editingFaq.answer.trim()) {
      showToast('FAQ title and answer are required.', true);
      return;
    }
    const keywords = faqKeywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const res = await dispatchStoreMutation('upsertOrbitFaq', {
      entry: { ...editingFaq, keywords },
    });
    if (!res.ok) {
      showToast(res.error || 'Failed to save FAQ entry.', true);
      return;
    }
    setFaqModalOpen(false);
    showToast('Orbit Assistant FAQ entry saved.');
  };

  const handleSaveOrbitConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatchStoreMutation('updateOrbitConfig', {
      config: orbitConfig,
    });
    if (!res.ok) {
      showToast(res.error || 'Could not update Orbit settings.', true);
      return;
    }
    showToast('Orbit Assistant & WhatsApp configuration saved.');
  };

  // ==========================================
  // MODULE 8: SEO MANAGEMENT STATE
  // ==========================================
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [editingSeo, setEditingSeo] = useState<SeoPageConfig | null>(null);

  const openNewSeoModal = () => {
    setEditingSeo({
      id: `SEO-${Date.now().toString().slice(-4)}`,
      route: '/new-page',
      pageName: '',
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: 'https://lijemrakel-trading.vercel.app/',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
      indexStatus: 'index, follow',
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
    setSeoModalOpen(true);
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeo || !editingSeo.route.trim() || !editingSeo.metaTitle.trim()) {
      showToast('Route path and Meta Title are required.', true);
      return;
    }
    const res = await dispatchStoreMutation('upsertSeo', {
      seoItem: {
        ...editingSeo,
        lastUpdated: new Date().toISOString().slice(0, 10),
      },
    });
    if (!res.ok) {
      showToast(res.error || 'Could not save SEO configuration.', true);
      return;
    }
    setSeoModalOpen(false);
    showToast(`SEO metadata updated for ${editingSeo.route}.`);
  };

  // Visible sidebar modules based on current user's RBAC permissions
  const allowedModules = useMemo(() => {
    if (!currentUser) return SIDEBAR_MODULES;
    return SIDEBAR_MODULES.filter((m) => canDo(m.id, 'view'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const unreadInquiriesCount = inquiries.filter(
    (i) => i.status === 'unread'
  ).length;

  // Global search results across modules, products, news, inquiries, and users
  const globalSearchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    const results: {
      id: string;
      title: string;
      subtitle: string;
      category: string;
      module: AdminModuleId;
    }[] = [];

    for (const mod of allowedModules) {
      if (mod.label.toLowerCase().includes(q)) {
        results.push({
          id: `mod-${mod.id}`,
          title: mod.label,
          subtitle: `Open ${mod.label} module`,
          category: 'Module',
          module: mod.id,
        });
      }
    }

    for (const p of products) {
      if (
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      ) {
        results.push({
          id: `prd-${p.id}`,
          title: p.name,
          subtitle: p.categoryName,
          category: 'Product',
          module: 'products',
        });
      }
    }

    for (const n of newsList) {
      if (n.title.toLowerCase().includes(q)) {
        results.push({
          id: `news-${n.id}`,
          title: n.title,
          subtitle: `${n.categoryLabel} · ${n.status}`,
          category: 'News',
          module: 'news',
        });
      }
    }

    for (const inq of inquiries) {
      if (
        inq.senderName.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q)
      ) {
        results.push({
          id: `inq-${inq.id}`,
          title: inq.subject,
          subtitle: `${inq.senderName} (${inq.email})`,
          category: 'Inquiry',
          module: 'inbox',
        });
      }
    }

    for (const u of usersList) {
      if (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      ) {
        results.push({
          id: `usr-${u.id}`,
          title: u.fullName,
          subtitle: `${u.roleName} · ${u.email}`,
          category: 'User',
          module: 'users',
        });
      }
    }

    return results.slice(0, 8);
  }, [globalSearch, allowedModules, products, newsList, inquiries, usersList]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F5F8] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#0B0E29] border-t-brand-orange animate-spin mx-auto" />
          <p className="text-xs font-heading font-bold text-[#0B0E29]">
            Loading Lijemrakel Admin Panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F8] flex text-[#0B0E29]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#0B0E29] text-white shrink-0 transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative h-9 w-11 rounded-lg bg-white p-1 shrink-0">
              <Image
                src="/images/logo/lijemrakel-logo.png"
                alt="Lijemrakel Trading PLC"
                fill
                sizes="44px"
                className="object-contain p-0.5"
              />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <span className="block font-heading text-sm font-extrabold text-white leading-none">
                  Lijemrakel
                </span>
                <span className="block text-[10px] text-brand-orange font-semibold mt-0.5">
                  Admin Panel
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links (10 Production Modules) */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {allowedModules.map((item) => {
            const Icon = item.icon;
            const active = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-heading font-bold transition-colors ${
                  active
                    ? 'bg-brand-orange text-[#0B0E29]'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>
                {!sidebarCollapsed &&
                  item.id === 'inbox' &&
                  unreadInquiriesCount > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        active
                          ? 'bg-[#0B0E29] text-white'
                          : 'bg-brand-orange text-[#0B0E29]'
                      }`}
                    >
                      {unreadInquiriesCount}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        {/* Signed-in User & Logout */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {!sidebarCollapsed && (
            <div className="px-2 py-1">
              <div className="text-xs font-heading font-bold text-white truncate">
                {currentUser.fullName}
              </div>
              <div className="text-[11px] text-brand-orange truncate">
                {currentUser.roleName}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-heading font-bold text-white/75 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="relative z-10 w-64 bg-[#0B0E29] text-white flex flex-col">
            <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-heading text-sm font-extrabold">
                Lijemrakel Admin
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {allowedModules.map((item) => {
                const Icon = item.icon;
                const active = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveModule(item.id);
                      setMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-heading font-bold ${
                      active
                        ? 'bg-brand-orange text-[#0B0E29]'
                        : 'text-white/75 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Matching Reference Design */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-[#0B0E29]"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Global Search Bar */}
            <div className="relative flex-1">
              <input
                type="search"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search anything..."
                className="w-full rounded-xl bg-[#F8FAFC] border border-slate-200/90 pl-4 pr-9 py-2 text-xs text-[#0B0E29] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
              />
              <SearchIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />

              {globalSearch.trim().length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                  {globalSearchResults.length === 0 ? (
                    <div className="p-4 text-xs text-slate-400 text-center">
                      No matching modules, products, articles, or inquiries.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {globalSearchResults.map((res) => (
                        <button
                          key={res.id}
                          type="button"
                          onClick={() => {
                            setActiveModule(res.module);
                            setGlobalSearch('');
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-heading font-bold text-[#0B0E29] truncate">
                              {res.title}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {res.subtitle}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-heading font-bold text-slate-600 shrink-0">
                            {res.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Live Website Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-heading font-bold text-[#0B0E29] transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen((o) => !o);
                  setLangMenuOpen(false);
                  setProfileMenuOpen(false);
                }}
                aria-label="Notifications"
                className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadInquiriesCount > 0
                    ? unreadInquiriesCount
                    : Math.min(9, inquiries.length || 1)}
                </span>
              </button>

              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-40 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-heading text-xs font-extrabold text-[#0B0E29]">
                        Notifications
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModule('inbox');
                          setNotificationsOpen(false);
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        Open Inbox
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {inquiries.slice(0, 3).map((inq) => (
                        <button
                          key={inq.id}
                          type="button"
                          onClick={() => {
                            setSelectedInquiryId(inq.id);
                            setActiveModule('inbox');
                            setNotificationsOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50"
                        >
                          <div className="text-xs font-bold text-[#0B0E29] truncate">
                            {inq.subject}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            From {inq.senderName} · {inq.date}
                          </div>
                        </button>
                      ))}
                      {auditLogs.slice(0, 3).map((log) => (
                        <div key={log.id} className="px-4 py-2.5">
                          <div className="text-xs font-medium text-[#0B0E29] truncate">
                            {log.action}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {log.actorName} · {log.target}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Language Selector Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangMenuOpen((o) => !o);
                  setNotificationsOpen(false);
                  setProfileMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-heading font-bold text-[#0B0E29] transition-colors"
              >
                <CountryFlag
                  code={selectedLang === 'EN' ? 'GB' : 'ET'}
                  className="w-4 h-3"
                />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl border border-slate-200 shadow-lg z-40 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLang('EN');
                        setLangMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50 flex items-center gap-2"
                    >
                      <CountryFlag code="GB" className="w-4 h-3" />
                      <span>English (EN)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLang('AM');
                        setLangMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50 flex items-center gap-2"
                    >
                      <CountryFlag code="ET" className="w-4 h-3" />
                      <span>አማርኛ (AM)</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Admin Profile Dropdown Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((o) => !o);
                  setNotificationsOpen(false);
                  setLangMenuOpen(false);
                }}
                className="flex items-center gap-2.5 pl-2 border-l border-slate-200 text-left"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#0B1938] text-brand-orange font-heading text-xs font-bold flex items-center justify-center border border-slate-200 shrink-0">
                  <Image
                    src="/images/leadership/leader-lijalem.jpg"
                    alt={currentUser.fullName}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div className="hidden sm:block text-xs">
                  <div className="font-heading font-extrabold text-[#0B0E29] leading-none">
                    {currentUser.fullName.toLowerCase().includes('administrator')
                      ? 'Admin'
                      : currentUser.fullName.split(' ')[0]}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {currentUser.roleName === 'Super Administrator'
                      ? 'Super Admin'
                      : currentUser.roleName}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {profileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-40 py-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-heading text-xs font-bold text-[#0B0E29] truncate">
                        {currentUser.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {currentUser.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModule('users');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      User &amp; Role Management
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModule('support');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Orbit Support Desk
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 max-w-sm">
            <div
              className={`rounded-2xl px-4 py-3 shadow-lg border text-xs font-heading font-bold flex items-center gap-2.5 ${
                toast.isError
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-[#0B0E29] text-white border-white/15'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0" />
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmDialog && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] max-w-sm w-full p-6 space-y-4 shadow-xl">
              <h3 className="font-heading text-base font-extrabold text-[#0B0E29]">
                Confirm Deletion
              </h3>
              <p className="text-xs text-brand-body leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong>{confirmDialog.label}</strong>? This action is recorded
                in the system audit log.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const fn = confirmDialog.onConfirm;
                    setConfirmDialog(null);
                    fn();
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-bold"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Module Workspace */}
        <div className="p-4 sm:p-7 space-y-6 max-w-[1480px] w-full mx-auto">
          {/* ========================================== */}
          {/* 1. DASHBOARD MODULE */}
          {/* ========================================== */}
          {activeModule === 'dashboard' && (
            <DashboardOverviewSection
              adminName={currentUser.fullName}
              analytics={analytics}
              selectedDays={selectedDays}
              customDateRange={customDateRange}
              onSelectDays={handleSelectAnalyticsDays}
              onApplyCustomDateRange={handleApplyCustomDateRange}
              inquiries={inquiries}
              newsList={newsList}
              products={products}
              mediaList={mediaList}
              usersList={usersList}
              auditLogs={auditLogs}
              onNavigateModule={(mod) => setActiveModule(mod)}
              onQuickAddNews={() => {
                setActiveModule('news');
                openNewArticleModal();
              }}
              onQuickAddProduct={() => {
                setActiveModule('products');
                openNewProductModal();
              }}
              onQuickUploadMedia={() => {
                setActiveModule('media');
                setUploadModalOpen(true);
              }}
            />
          )}

          {/* ========================================== */}
          {/* 2. INBOX MODULE (REAL INQUIRIES & SMTP REPLY) */}
          {/* ========================================== */}
          {activeModule === 'inbox' && (
            <div className="space-y-5">
              <div className="bg-white rounded-[24px] border border-brand-border/80 p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {(['all', 'unread', 'read', 'replied', 'archived'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setInboxFilter(st)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold capitalize transition-colors ${
                          inboxFilter === st
                            ? 'bg-[#0B0E29] text-white'
                            : 'bg-[#FAF9F5] text-brand-muted hover:text-[#0B0E29]'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>

                <input
                  type="search"
                  value={inboxSearch}
                  onChange={(e) => setInboxSearch(e.target.value)}
                  placeholder="Search sender, email, or subject..."
                  className="rounded-xl bg-[#FAF9F5] border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29] w-full sm:w-64 focus:outline-none focus:border-[#0B0E29]"
                />
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="bg-white rounded-[24px] border border-brand-border/80 p-12 text-center space-y-2">
                  <Inbox className="w-8 h-8 text-brand-muted/50 mx-auto" />
                  <h3 className="font-heading text-base font-extrabold text-[#0B0E29]">
                    No inquiries found
                  </h3>
                  <p className="text-xs text-brand-muted max-w-md mx-auto">
                    Messages submitted by visitors through the public{' '}
                    <Link href="/contact" className="underline text-[#0B0E29]">
                      /contact
                    </Link>{' '}
                    form appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Inquiry List */}
                  <div className="lg:col-span-5 bg-white rounded-[24px] border border-brand-border/80 divide-y divide-brand-border/60 overflow-hidden">
                    {filteredInquiries.map((item) => {
                      const selected = activeInquiry?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedInquiryId(item.id);
                            setReplySubject(`Re: ${item.subject}`);
                            if (item.status === 'unread') {
                              dispatchStoreMutation('updateInquiryStatus', {
                                id: item.id,
                                status: 'read',
                              });
                            }
                          }}
                          className={`w-full text-left p-4 transition-colors ${
                            selected ? 'bg-[#0B0E29] text-white' : 'hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-heading font-bold truncate">
                              {item.senderName}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                item.status === 'unread'
                                  ? 'bg-brand-orange text-[#0B0E29]'
                                  : selected
                                  ? 'bg-white/15 text-white'
                                  : 'bg-[#FAF9F5] text-brand-muted'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div
                            className={`text-xs font-semibold mt-1 truncate ${
                              selected ? 'text-white/90' : 'text-[#0B0E29]'
                            }`}
                          >
                            {item.subject}
                          </div>
                          <div
                            className={`text-[11px] mt-1 flex items-center justify-between ${
                              selected ? 'text-white/60' : 'text-brand-muted'
                            }`}
                          >
                            <span>{item.organization}</span>
                            <span>{item.date}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inquiry Detail & Real SMTP Reply Form */}
                  {activeInquiry && (
                    <div className="lg:col-span-7 bg-white rounded-[24px] border border-brand-border/80 p-6 space-y-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-border/70 pb-4">
                        <div>
                          <span className="text-[11px] font-heading font-bold uppercase text-brand-orange">
                            {activeInquiry.inquiryType} · {activeInquiry.id}
                          </span>
                          <h3 className="font-heading text-lg font-extrabold text-[#0B0E29] mt-0.5">
                            {activeInquiry.subject}
                          </h3>
                          <p className="text-xs text-brand-muted mt-1">
                            From <strong>{activeInquiry.senderName}</strong> (
                            {activeInquiry.organization}) · {activeInquiry.email}{' '}
                            · {activeInquiry.phone}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={activeInquiry.status}
                            onChange={(e) =>
                              dispatchStoreMutation('updateInquiryStatus', {
                                id: activeInquiry.id,
                                status: e.target.value,
                              })
                            }
                            className="rounded-xl border border-brand-border px-3 py-1.5 text-xs font-heading font-bold text-[#0B0E29] bg-[#FAF9F5]"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>

                          {canDo('inbox', 'delete') && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDialog({
                                  label: `inquiry from ${activeInquiry.senderName}`,
                                  onConfirm: async () => {
                                    await dispatchStoreMutation(
                                      'deleteInquiry',
                                      { id: activeInquiry.id }
                                    );
                                    showToast('Inquiry deleted.');
                                  },
                                })
                              }
                              className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-[#FAF9F5] p-4 text-xs sm:text-sm text-[#0B0E29] leading-relaxed whitespace-pre-wrap border border-brand-border/60">
                        {activeInquiry.message}
                      </div>

                      {/* Sent Replies Log */}
                      {activeInquiry.replies &&
                        activeInquiry.replies.length > 0 && (
                          <div className="space-y-2.5">
                            <div className="text-xs font-heading font-bold text-[#0B0E29]">
                              Sent Email Replies ({activeInquiry.replies.length})
                            </div>
                            {activeInquiry.replies.map((rep) => (
                              <div
                                key={rep.id}
                                className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                                  <span>
                                    Sent by {rep.sentByName} to {rep.toEmail}
                                  </span>
                                  <span>{rep.sentAt}</span>
                                </div>
                                <div className="font-bold text-[#0B0E29]">
                                  {rep.subject}
                                </div>
                                <p className="text-brand-body whitespace-pre-wrap">
                                  {rep.body}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Direct SMTP Email Reply Form */}
                      {canDo('inbox', 'edit') && (
                        <form
                          onSubmit={handleSendReply}
                          className="border-t border-brand-border/70 pt-5 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-heading font-bold text-[#0B0E29]">
                              Reply via SMTP ({smtpStatus?.user || 'technical_support@orbit.et'})
                            </span>
                            <span className="text-[11px] text-brand-muted">
                              To: {activeInquiry.email}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={replySubject}
                            onChange={(e) => setReplySubject(e.target.value)}
                            placeholder={`Re: ${activeInquiry.subject}`}
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                          <textarea
                            rows={4}
                            required
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            placeholder={`Write your email response to ${activeInquiry.senderName}...`}
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
                          />
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={sendingReply}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>
                                {sendingReply
                                  ? 'Sending Email...'
                                  : 'Send Email Reply'}
                              </span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* 3. NEWS MODULE */}
          {/* ========================================== */}
          {activeModule === 'news' && (
            <div className="space-y-5">
              <div className="bg-white rounded-[24px] border border-brand-border/80 p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {(['all', 'Published', 'Scheduled', 'Draft'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setNewsStatusFilter(st)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-colors ${
                          newsStatusFilter === st
                            ? 'bg-[#0B0E29] text-white'
                            : 'bg-[#FAF9F5] text-brand-muted hover:text-[#0B0E29]'
                        }`}
                      >
                        {st === 'all' ? 'All Articles' : st}
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="search"
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="rounded-xl bg-[#FAF9F5] border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                  />
                  {canDo('news', 'create') && (
                    <button
                      type="button"
                      onClick={openNewArticleModal}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Article</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {newsList
                  .filter((n) => {
                    if (
                      newsStatusFilter !== 'all' &&
                      n.status !== newsStatusFilter
                    )
                      return false;
                    const q = newsSearch.toLowerCase();
                    return (
                      !q ||
                      n.title.toLowerCase().includes(q) ||
                      n.excerpt.toLowerCase().includes(q)
                    );
                  })
                  .map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-[24px] border border-brand-border/80 overflow-hidden shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 bg-[#0B0E29] group">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="400px"
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-full bg-[#0B0E29]/90 text-white text-[10px] font-heading font-bold">
                              {article.categoryLabel}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-bold ${
                                article.status === 'Published'
                                  ? 'bg-emerald-500 text-white'
                                  : article.status === 'Scheduled'
                                  ? 'bg-brand-orange text-[#0B0E29]'
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              {article.status}
                            </span>
                          </div>
                          {canDo('news', 'edit') && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNews({ ...article });
                                setNewsModalOpen(true);
                              }}
                              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-brand-orange text-white hover:text-[#0B0E29] text-[11px] font-heading font-bold backdrop-blur-xs transition-all"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Change Photo</span>
                            </button>
                          )}
                        </div>

                        <div className="p-5 space-y-2">
                          <div className="text-[11px] text-brand-muted flex items-center justify-between">
                            <span>{article.authorName}</span>
                            <span>
                              {article.status === 'Scheduled' &&
                              article.scheduledFor
                                ? `Scheduled: ${article.scheduledFor}`
                                : article.date}
                            </span>
                          </div>
                          <h3 className="font-heading text-sm font-extrabold text-[#0B0E29] line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-xs text-brand-body line-clamp-3">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 py-3.5 border-t border-brand-border/60 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setPreviewNews(article)}
                          className="inline-flex items-center gap-1 text-xs font-heading font-bold text-[#0B0E29] hover:text-brand-orange"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {canDo('news', 'edit') && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNews({ ...article });
                                setNewsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-brand-border text-[#0B0E29] hover:bg-[#FAF9F5]"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDo('news', 'delete') && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDialog({
                                  label: article.title,
                                  onConfirm: async () => {
                                    await dispatchStoreMutation('deleteNews', {
                                      id: article.id,
                                    });
                                    showToast('Article deleted.');
                                  },
                                })
                              }
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Create/Edit News Modal */}
              {newsModalOpen && editingNews && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 sm:p-7 space-y-4 shadow-xl my-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-extrabold text-[#0B0E29]">
                        {newsList.some((n) => n.id === editingNews.id)
                          ? 'Edit News Article'
                          : 'Create News Article'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setNewsModalOpen(false)}
                        className="p-1.5 text-brand-muted hover:text-[#0B0E29]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveNews} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Article Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingNews.title}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              title: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Category
                          </label>
                          <select
                            value={editingNews.categoryLabel}
                            onChange={(e) =>
                              setEditingNews({
                                ...editingNews,
                                categoryLabel: e.target
                                  .value as AdminNewsPost['categoryLabel'],
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs text-[#0B0E29] bg-white"
                          >
                            <option value="Company News">Company News</option>
                            <option value="Announcements">Announcements</option>
                            <option value="Business Updates">
                              Business Updates
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Publication Status
                          </label>
                          <select
                            value={editingNews.status}
                            onChange={(e) =>
                              setEditingNews({
                                ...editingNews,
                                status: e.target
                                  .value as AdminNewsPost['status'],
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs text-[#0B0E29] bg-white"
                          >
                            <option value="Published">Published</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            {editingNews.status === 'Scheduled'
                              ? 'Schedule Date *'
                              : 'Display Date'}
                          </label>
                          <input
                            type={
                              editingNews.status === 'Scheduled'
                                ? 'date'
                                : 'text'
                            }
                            value={
                              editingNews.status === 'Scheduled'
                                ? editingNews.scheduledFor || ''
                                : editingNews.date
                            }
                            onChange={(e) =>
                              setEditingNews(
                                editingNews.status === 'Scheduled'
                                  ? {
                                      ...editingNews,
                                      scheduledFor: e.target.value,
                                    }
                                  : { ...editingNews, date: e.target.value }
                              )
                            }
                            className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={editingNews.authorName}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              authorName: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <ImageUploadPicker
                        label="Article Cover Photo"
                        value={editingNews.image}
                        onChange={(newUrl) =>
                          setEditingNews({
                            ...editingNews,
                            image: newUrl,
                          })
                        }
                        category="Hero & Office"
                        defaultTitle={editingNews.title || 'News Article Cover'}
                        mediaLibrary={mediaList}
                        onMediaUploaded={(_, updatedMedia) =>
                          setMediaList(updatedMedia)
                        }
                        helperText="Upload directly from your computer or select from Media Library. Saved changes immediately update the public News page."
                      />

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Summary Excerpt *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={editingNews.excerpt}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              excerpt: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Full Article Body
                        </label>
                        <textarea
                          rows={5}
                          value={editingNews.content || ''}
                          onChange={(e) =>
                            setEditingNews({
                              ...editingNews,
                              content: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setNewsModalOpen(false)}
                          className="px-4 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                        >
                          Save Article
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Article Preview Modal */}
              {previewNews && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-[24px] max-w-xl w-full p-6 space-y-4 shadow-xl my-8">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#0B0E29] text-white text-xs font-heading font-bold">
                        {previewNews.categoryLabel} · {previewNews.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewNews(null)}
                        className="p-1.5 text-brand-muted hover:text-[#0B0E29]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-heading text-xl font-extrabold text-[#0B0E29]">
                      {previewNews.title}
                    </h3>
                    <div className="text-xs text-brand-muted">
                      By {previewNews.authorName} · {previewNews.date}
                    </div>
                    <p className="text-xs font-semibold text-[#0B0E29] bg-[#FAF9F5] p-3.5 rounded-xl">
                      {previewNews.excerpt}
                    </p>
                    {previewNews.content && (
                      <div className="text-xs text-brand-body whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                        {previewNews.content}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* 4. PRODUCTS & CATEGORIES MODULE */}
          {/* ========================================== */}
          {activeModule === 'products' && (
            <div className="space-y-5">
              {/* Sub-tab Switcher: Products vs Categories */}
              <div className="bg-white rounded-[24px] border border-brand-border/80 p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-[#FAF9F5] p-1 rounded-xl border border-brand-border">
                  <button
                    type="button"
                    onClick={() => setProductSubTab('products')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-bold transition-colors ${
                      productSubTab === 'products'
                        ? 'bg-[#0B0E29] text-white'
                        : 'text-brand-muted hover:text-[#0B0E29]'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Products Catalogue ({products.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductSubTab('categories')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-bold transition-colors ${
                      productSubTab === 'categories'
                        ? 'bg-[#0B0E29] text-white'
                        : 'text-brand-muted hover:text-[#0B0E29]'
                    }`}
                  >
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>Product Categories ({categories.length})</span>
                  </button>
                </div>

                {productSubTab === 'products' ? (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="rounded-xl bg-[#FAF9F5] border border-brand-border px-3 py-2 text-xs text-[#0B0E29]"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="search"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search products..."
                      className="rounded-xl bg-[#FAF9F5] border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                    />
                    {canDo('products', 'create') && (
                      <button
                        type="button"
                        onClick={openNewProductModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Product</span>
                      </button>
                    )}
                  </div>
                ) : (
                  canDo('products', 'create') && (
                    <button
                      type="button"
                      onClick={openNewCategoryModal}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Category</span>
                    </button>
                  )
                )}
              </div>

              {productSubTab === 'products' && (
                <div className="bg-white rounded-[24px] border border-brand-border/80 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#FAF9F5] border-b border-brand-border/70 text-[11px] font-heading font-bold uppercase text-brand-muted">
                          <th className="py-3.5 px-5">Product Name</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Dosage Form &amp; Pack</th>
                          <th className="py-3.5 px-4">Target Species</th>
                          <th className="py-3.5 px-4">Cold-Chain</th>
                          <th className="py-3.5 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/60">
                        {products
                          .filter((p) => {
                            if (
                              productCategoryFilter !== 'all' &&
                              p.categorySlug !== productCategoryFilter
                            )
                              return false;
                            const q = productSearch.toLowerCase();
                            return (
                              !q ||
                              p.name.toLowerCase().includes(q) ||
                              (p.subcategory || '').toLowerCase().includes(q) ||
                              p.activeIngredientOrComposition
                                .toLowerCase()
                                .includes(q)
                            );
                          })
                          .map((prod) => (
                            <tr
                              key={prod.id}
                              className="hover:bg-[#FAF9F5]/60"
                            >
                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#0B0E29] shrink-0 border border-slate-200">
                                    <Image
                                      src={prod.image}
                                      alt={prod.name}
                                      fill
                                      sizes="44px"
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                  <div>
                                    <div className="font-heading font-bold text-[#0B0E29]">
                                      {prod.name}
                                    </div>
                                    <div className="text-[11px] text-brand-muted">
                                      {prod.activeIngredientOrComposition}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-semibold text-[#0B0E29] block">
                                  {prod.categoryName}
                                </span>
                                <span className="text-[11px] text-brand-muted">
                                  {prod.subcategory}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-brand-body">
                                {prod.dosageForm} · {prod.packSize}
                              </td>
                              <td className="py-3.5 px-4 text-brand-body">
                                {prod.intendedSpecies.join(', ')}
                              </td>
                              <td className="py-3.5 px-4">
                                {prod.coldChainRequired ? (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                                    +2°C to +8°C
                                  </span>
                                ) : (
                                  <span className="text-brand-muted">
                                    Standard
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-5 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  {canDo('products', 'edit') && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProduct({ ...prod });
                                        setProductModalOpen(true);
                                      }}
                                      className="p-1.5 rounded-lg border border-brand-border text-[#0B0E29] hover:bg-[#FAF9F5]"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {canDo('products', 'delete') && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setConfirmDialog({
                                          label: prod.name,
                                          onConfirm: async () => {
                                            await dispatchStoreMutation(
                                              'deleteProduct',
                                              { id: prod.id }
                                            );
                                            showToast('Product deleted.');
                                          },
                                        })
                                      }
                                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {productSubTab === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {categories.map((cat) => {
                    const count = products.filter(
                      (p) => p.categorySlug === cat.slug
                    ).length;
                    return (
                      <div
                        key={cat.id}
                        className="bg-white rounded-[24px] border border-brand-border/80 p-6 space-y-3 shadow-2xs flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-heading text-base font-extrabold text-[#0B0E29]">
                              {cat.name}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-brand-border text-xs font-heading font-bold text-[#0B0E29]">
                              {count} products
                            </span>
                          </div>
                          <p className="text-xs text-brand-body">
                            {cat.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cat.subcategories.map((sub) => (
                              <span
                                key={sub}
                                className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] text-[11px] font-semibold text-[#0B0E29]"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-brand-border/60 flex justify-end gap-2">
                          {canDo('products', 'edit') && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategory({ ...cat });
                                setSubcatInput(cat.subcategories.join(', '));
                                setCategoryModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-border text-xs font-heading font-bold text-[#0B0E29] hover:bg-[#FAF9F5]"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          )}
                          {canDo('products', 'delete') && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDialog({
                                  label: cat.name,
                                  onConfirm: async () => {
                                    await dispatchStoreMutation(
                                      'deleteCategory',
                                      { id: cat.id }
                                    );
                                    showToast('Category deleted.');
                                  },
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-heading font-bold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Product Modal */}
              {productModalOpen && editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 sm:p-7 space-y-4 shadow-xl my-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-extrabold text-[#0B0E29]">
                        {products.some((p) => p.id === editingProduct.id)
                          ? 'Edit Product'
                          : 'Add New Product'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setProductModalOpen(false)}
                        className="p-1.5 text-brand-muted hover:text-[#0B0E29]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                name: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Category *
                          </label>
                          <select
                            value={editingProduct.categorySlug}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                categorySlug: e.target
                                  .value as ProductItem['categorySlug'],
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29] bg-white"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.slug}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Subcategory
                          </label>
                          <input
                            type="text"
                            value={editingProduct.subcategory || ''}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                subcategory: e.target.value as VetMedSubcategory,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Dosage Form
                          </label>
                          <input
                            type="text"
                            value={editingProduct.dosageForm}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                dosageForm: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Pack Size
                          </label>
                          <input
                            type="text"
                            value={editingProduct.packSize}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                packSize: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Composition / Active Ingredient
                          </label>
                          <input
                            type="text"
                            value={editingProduct.activeIngredientOrComposition}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                activeIngredientOrComposition: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Target Species (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={editingProduct.intendedSpecies.join(', ')}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                intendedSpecies: e.target.value
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Approved Indications Summary
                        </label>
                        <textarea
                          rows={2}
                          value={editingProduct.approvedIndicationsSummary}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              approvedIndicationsSummary: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <ImageUploadPicker
                        label="Product Photo"
                        value={editingProduct.image}
                        onChange={(newUrl) =>
                          setEditingProduct({
                            ...editingProduct,
                            image: newUrl,
                          })
                        }
                        category="Products"
                        defaultTitle={editingProduct.name || 'Product Photo'}
                        mediaLibrary={mediaList}
                        onMediaUploaded={(_, updatedMedia) =>
                          setMediaList(updatedMedia)
                        }
                        previewHeightClass="h-40"
                        helperText="Upload a product photo from your computer or pick from Media Library."
                      />

                      <label className="flex items-center gap-2 text-xs font-bold text-[#0B0E29] pt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.coldChainRequired}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              coldChainRequired: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-[#0B0E29]"
                        />
                        <span>Requires +2°C to +8°C Cold-Chain Storage</span>
                      </label>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setProductModalOpen(false)}
                          className="px-4 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                        >
                          Save Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Category Modal */}
              {categoryModalOpen && editingCategory && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-extrabold text-[#0B0E29]">
                        {categories.some((c) => c.id === editingCategory.id)
                          ? 'Edit Product Category'
                          : 'Add Product Category'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCategoryModalOpen(false)}
                        className="p-1.5 text-brand-muted hover:text-[#0B0E29]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveCategory} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              name: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={editingCategory.description}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              description: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Subcategories (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={subcatInput}
                          onChange={(e) => setSubcatInput(e.target.value)}
                          placeholder="e.g., Anthelmintics, Antibiotics, Vitamins"
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setCategoryModalOpen(false)}
                          className="px-4 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold"
                        >
                          Save Category
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* 5. TEAMS MODULE */}
          {/* ========================================== */}
          {activeModule === 'teams' && (
            <div className="space-y-5">
              <div className="bg-white rounded-[24px] border border-brand-border/80 p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-base font-extrabold text-[#0B0E29]">
                    Leadership &amp; Executive Team ({teamList.length})
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Manage founders, board members, and executive leadership profiles
                  </p>
                </div>
                {canDo('teams', 'create') && (
                  <button
                    type="button"
                    onClick={openNewMemberModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Team Member</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {teamList.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-[24px] border border-brand-border/80 overflow-hidden shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="p-5 flex items-center gap-4 border-b border-brand-border/60">
                        <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#0B0E29] shrink-0 group">
                          {member.portraitUrl ? (
                            <Image
                              src={member.portraitUrl}
                              alt={member.displayName}
                              fill
                              sizes="80px"
                              className="object-cover object-top"
                              unoptimized
                            />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center text-white font-heading font-bold">
                              {member.initials}
                            </span>
                          )}
                          {canDo('teams', 'edit') && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMember({ ...member });
                                setRespText(member.responsibilities.join('\n'));
                                setTeamModalOpen(true);
                              }}
                              title="Change profile photo"
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity"
                            >
                              <Upload className="w-3.5 h-3.5 text-brand-orange mb-0.5" />
                              <span>Photo</span>
                            </button>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading text-sm font-extrabold text-[#0B0E29] truncate">
                            {member.displayName}
                          </h3>
                          <div className="text-xs font-semibold text-brand-orange">
                            {member.roleTitle}
                          </div>
                          <div className="text-[11px] text-brand-muted">
                            {member.department}
                          </div>
                          {canDo('teams', 'edit') && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMember({ ...member });
                                setRespText(member.responsibilities.join('\n'));
                                setTeamModalOpen(true);
                              }}
                              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-heading font-bold text-blue-600 hover:text-brand-orange transition-colors"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload / Replace Photo</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <p className="text-xs text-brand-body leading-relaxed">
                          {member.summary}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 border-t border-brand-border/60 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {member.isFoundingMember && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-orange/20 text-[#0B0E29] text-[10px] font-heading font-bold">
                            Founder
                          </span>
                        )}
                        {member.isProposedBoardMember && (
                          <span className="px-2 py-0.5 rounded-full bg-[#0B0E29]/10 text-[#0B0E29] text-[10px] font-heading font-bold">
                            Board
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {canDo('teams', 'edit') && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMember({ ...member });
                              setRespText(member.responsibilities.join('\n'));
                              setTeamModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-brand-border text-[#0B0E29] hover:bg-[#FAF9F5]"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canDo('teams', 'delete') && (
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDialog({
                                label: member.displayName,
                                onConfirm: async () => {
                                  await dispatchStoreMutation(
                                    'deleteTeamMember',
                                    { id: member.id }
                                  );
                                  showToast('Team member deleted.');
                                },
                              })
                            }
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {teamModalOpen && editingMember && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-[24px] max-w-xl w-full p-6 space-y-4 shadow-xl my-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-extrabold text-[#0B0E29]">
                        {teamList.some((m) => m.id === editingMember.id)
                          ? 'Edit Team Profile'
                          : 'Add Team Profile'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setTeamModalOpen(false)}
                        className="p-1.5 text-brand-muted hover:text-[#0B0E29]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveMember} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Title Prefix
                          </label>
                          <select
                            value={editingMember.formalTitlePrefix}
                            onChange={(e) =>
                              setEditingMember({
                                ...editingMember,
                                formalTitlePrefix: e.target
                                  .value as ExecutiveMember['formalTitlePrefix'],
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs text-[#0B0E29] bg-white"
                          >
                            <option value="Mr">Mr</option>
                            <option value="Dr">Dr</option>
                            <option value="Ato">Ato</option>
                            <option value="Ms">Ms</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingMember.name}
                            onChange={(e) =>
                              setEditingMember({
                                ...editingMember,
                                name: e.target.value,
                                displayName: `${editingMember.formalTitlePrefix} ${e.target.value}`,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Job Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingMember.roleTitle}
                            onChange={(e) =>
                              setEditingMember({
                                ...editingMember,
                                roleTitle: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Department / Governance Role
                          </label>
                          <input
                            type="text"
                            value={editingMember.department}
                            onChange={(e) =>
                              setEditingMember({
                                ...editingMember,
                                department: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                      </div>

                      <ImageUploadPicker
                        label="Executive Portrait Photo"
                        value={editingMember.portraitUrl || ''}
                        onChange={(newUrl) =>
                          setEditingMember({
                            ...editingMember,
                            portraitUrl: newUrl,
                          })
                        }
                        category="Leadership"
                        defaultTitle={
                          editingMember.displayName ||
                          editingMember.name ||
                          'Leadership Portrait'
                        }
                        mediaLibrary={mediaList}
                        onMediaUploaded={(_, updatedMedia) =>
                          setMediaList(updatedMedia)
                        }
                        previewHeightClass="h-48"
                        objectPositionClass="object-top"
                        helperText="Upload a portrait directly from your computer or choose from Media Library. Automatically updates Homepage and Leadership pages."
                      />

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Biography Summary
                        </label>
                        <textarea
                          rows={3}
                          value={editingMember.summary}
                          onChange={(e) =>
                            setEditingMember({
                              ...editingMember,
                              summary: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Key Responsibilities (one per line)
                        </label>
                        <textarea
                          rows={3}
                          value={respText}
                          onChange={(e) => setRespText(e.target.value)}
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <div className="flex items-center gap-5 text-xs font-bold text-[#0B0E29]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingMember.isFoundingMember}
                            onChange={(e) =>
                              setEditingMember({
                                ...editingMember,
                                isFoundingMember: e.target.checked,
                              })
                            }
                            className="w-4 h-4 accent-[#0B0E29]"
                          />
                          <span>Founding Member</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingMember.isProposedBoardMember}
                            onChange={(e) =>
                              setEditingMember({
                                ...editingMember,
                                isProposedBoardMember: e.target.checked,
                              })
                            }
                            className="w-4 h-4 accent-[#0B0E29]"
                          />
                          <span>Board of Directors</span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setTeamModalOpen(false)}
                          className="px-4 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold"
                        >
                          Save Profile
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* 6. MEDIA LIBRARY & WEBSITE CONTENT PHOTOS MODULE */}
          {/* ========================================== */}
          {activeModule === 'media' && (
            <div className="space-y-5">
              {/* Top Bar with Sub-tab Switcher */}
              <div className="bg-white rounded-[24px] border border-brand-border/80 p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 bg-[#FAF9F5] p-1 rounded-xl border border-brand-border">
                  <button
                    type="button"
                    onClick={() => setMediaSubTab('library')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-bold transition-colors ${
                      mediaSubTab === 'library'
                        ? 'bg-[#0B0E29] text-white'
                        : 'text-brand-muted hover:text-[#0B0E29]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>All Media Assets ({mediaList.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaSubTab('site-images')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-bold transition-colors ${
                      mediaSubTab === 'site-images'
                        ? 'bg-[#0B0E29] text-white'
                        : 'text-brand-muted hover:text-[#0B0E29]'
                    }`}
                  >
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>Website Content Photos (8 Sections)</span>
                  </button>
                </div>

                {mediaSubTab === 'library' ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="search"
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                      placeholder="Search files..."
                      className="rounded-xl bg-[#FAF9F5] border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                    />
                    {canDo('media', 'create') && (
                      <button
                        type="button"
                        onClick={() => setUploadModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Computer</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={savingSiteImages}
                    onClick={() =>
                      handleSaveSiteImages(siteImages, 'All Website Section Photos')
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {savingSiteImages
                        ? 'Saving to Website...'
                        : 'Save All Website Photos'}
                    </span>
                  </button>
                )}
              </div>

              {mediaSubTab === 'library' && (
                <>
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(
                      [
                        'all',
                        'Logo & Brand',
                        'Hero & Office',
                        'Leadership',
                        'Strategy',
                        'Products',
                        'Document',
                      ] as const
                    ).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setMediaCategoryFilter(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-colors ${
                          mediaCategoryFilter === cat
                            ? 'bg-[#0B0E29] text-white'
                            : 'bg-white border border-brand-border/80 text-brand-muted hover:text-[#0B0E29]'
                        }`}
                      >
                        {cat === 'all' ? 'All Categories' : cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {mediaList
                      .filter((m) => {
                        if (
                          mediaCategoryFilter !== 'all' &&
                          m.category !== mediaCategoryFilter
                        )
                          return false;
                        const q = mediaSearch.toLowerCase();
                        return (
                          !q ||
                          m.title.toLowerCase().includes(q) ||
                          m.fileName.toLowerCase().includes(q)
                        );
                      })
                      .map((asset) => (
                        <div
                          key={asset.id}
                          className="bg-white rounded-[24px] border border-brand-border/80 overflow-hidden shadow-2xs flex flex-col justify-between group"
                        >
                          <div>
                            <div className="relative h-44 bg-[#0B0E29]/95 flex items-center justify-center overflow-hidden">
                              <Image
                                src={asset.url}
                                alt={asset.altText || asset.title}
                                fill
                                sizes="300px"
                                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                unoptimized
                              />
                              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#0B0E29]/85 text-white text-[10px] font-heading font-bold">
                                {asset.category}
                              </span>
                              {canDo('media', 'edit') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMediaAsset({ ...asset });
                                    setReplacingMediaFile(null);
                                  }}
                                  className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/75 hover:bg-brand-orange text-white hover:text-[#0B0E29] text-[10px] font-heading font-bold backdrop-blur-xs transition-all"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>Replace / Edit</span>
                                </button>
                              )}
                            </div>
                            <div className="p-4 space-y-1">
                              <div className="font-heading text-xs font-extrabold text-[#0B0E29] truncate">
                                {asset.title}
                              </div>
                              <div className="font-mono text-[10px] text-brand-muted truncate">
                                {asset.fileName}
                              </div>
                              <div className="text-[10px] text-brand-muted">
                                {asset.fileType} · {asset.uploadedAt}
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-3 border-t border-brand-border/60 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(asset.url);
                                setCopiedMediaId(asset.id);
                                setTimeout(() => setCopiedMediaId(null), 1500);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-[#0B0E29] hover:text-brand-orange"
                            >
                              {copiedMediaId === asset.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Copied URL</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy URL</span>
                                </>
                              )}
                            </button>

                            <div className="flex items-center gap-1">
                              {canDo('media', 'edit') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMediaAsset({ ...asset });
                                    setReplacingMediaFile(null);
                                  }}
                                  className="p-1.5 rounded-lg border border-brand-border text-[#0B0E29] hover:bg-[#FAF9F5]"
                                  title="Edit or replace file"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {canDo('media', 'delete') && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmDialog({
                                      label: asset.title,
                                      onConfirm: async () => {
                                        await dispatchStoreMutation(
                                          'deleteMedia',
                                          { id: asset.id }
                                        );
                                        showToast('Media file removed.');
                                      },
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {mediaSubTab === 'site-images' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(
                    [
                      {
                        key: 'homeHeroImage' as const,
                        title: 'Homepage Hero Banner Photo',
                        subtitle:
                          'Displayed in the main Hero section on the public Homepage (/)',
                        category: 'Hero & Office' as const,
                      },
                      {
                        key: 'homeAboutMainImage' as const,
                        title: 'Homepage About Section — Main Photo',
                        subtitle:
                          'Primary office/facility photo in the Homepage About collage',
                        category: 'Hero & Office' as const,
                      },
                      {
                        key: 'homeAboutAccentImage' as const,
                        title: 'Homepage About Section — Secondary Photo',
                        subtitle:
                          'Overlapping secondary card photo in the Homepage About section',
                        category: 'Products' as const,
                      },
                      {
                        key: 'aboutOfficeImage' as const,
                        title: 'About Us Page — Company Overview Photo',
                        subtitle:
                          'Main executive office photo on the /about Company Overview page',
                        category: 'Hero & Office' as const,
                      },
                      {
                        key: 'strategyPhase1Image' as const,
                        title: 'Strategy Page — Phase 1 Photo',
                        subtitle:
                          'Phase 1 (Import Operations & Market Entry) photo on /about/strategy',
                        category: 'Strategy' as const,
                      },
                      {
                        key: 'strategyPhase2Image' as const,
                        title: 'Strategy Page — Phase 2 Photo',
                        subtitle:
                          'Phase 2 (Distribution & Cold-Chain Expansion) photo on /about/strategy',
                        category: 'Strategy' as const,
                      },
                      {
                        key: 'strategyPhase3Image' as const,
                        title: 'Strategy Page — Phase 3 Photo',
                        subtitle:
                          'Phase 3 (Poultry & Hatchery Development) photo on /about/strategy',
                        category: 'Strategy' as const,
                      },
                      {
                        key: 'strategyPhase4Image' as const,
                        title: 'Strategy Page — Phase 4 Photo',
                        subtitle:
                          'Phase 4 (Integrated Agro-Industrial Growth) photo on /about/strategy',
                        category: 'Strategy' as const,
                      },
                    ]
                  ).map((slot) => (
                    <div
                      key={slot.key}
                      className="bg-white rounded-[24px] border border-brand-border/80 p-6 space-y-3 shadow-2xs"
                    >
                      <div>
                        <h3 className="font-heading text-sm font-extrabold text-[#0B0E29]">
                          {slot.title}
                        </h3>
                        <p className="text-xs text-brand-muted">
                          {slot.subtitle}
                        </p>
                      </div>

                      <ImageUploadPicker
                        label="Section Photo"
                        value={siteImages[slot.key]}
                        onChange={(newUrl) => {
                          const updated = {
                            ...siteImages,
                            [slot.key]: newUrl,
                          };
                          setSiteImages(updated);
                          handleSaveSiteImages(updated, slot.title);
                        }}
                        category={slot.category}
                        defaultTitle={slot.title}
                        mediaLibrary={mediaList}
                        onMediaUploaded={(_, updatedMedia) =>
                          setMediaList(updatedMedia)
                        }
                        previewHeightClass="h-48"
                        helperText="Changes save automatically and reflect immediately on the public website."
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Edit / Replace Existing Media Asset Modal */}
              {editingMediaAsset && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-xl my-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-extrabold text-[#0B0E29]">
                        Edit or Replace Media Photo
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMediaAsset(null);
                          setReplacingMediaFile(null);
                        }}
                        className="p-1.5 text-brand-muted hover:text-[#0B0E29]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditedMedia} className="space-y-4">
                      <div className="relative h-48 rounded-2xl overflow-hidden bg-[#0B0E29] border border-slate-200">
                        <img
                          src={
                            replacingMediaFile
                              ? URL.createObjectURL(replacingMediaFile)
                              : editingMediaAsset.url
                          }
                          alt={editingMediaAsset.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                          <input
                            ref={replaceFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              setReplacingMediaFile(f);
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => replaceFileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-orange text-[#0B0E29] text-xs font-heading font-bold shadow-md"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {replacingMediaFile
                                ? `Selected: ${replacingMediaFile.name}`
                                : 'Choose New File from Computer'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Photo Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingMediaAsset.title}
                          onChange={(e) =>
                            setEditingMediaAsset({
                              ...editingMediaAsset,
                              title: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Category
                          </label>
                          <select
                            value={editingMediaAsset.category}
                            onChange={(e) =>
                              setEditingMediaAsset({
                                ...editingMediaAsset,
                                category: e.target
                                  .value as MediaAssetItem['category'],
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29] bg-white"
                          >
                            <option value="Hero & Office">Hero &amp; Office</option>
                            <option value="Logo & Brand">Logo &amp; Brand</option>
                            <option value="Leadership">Leadership</option>
                            <option value="Strategy">Strategy</option>
                            <option value="Products">Products</option>
                            <option value="Document">Document</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            value={editingMediaAsset.altText}
                            onChange={(e) =>
                              setEditingMediaAsset({
                                ...editingMediaAsset,
                                altText: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMediaAsset(null);
                            setReplacingMediaFile(null);
                          }}
                          className="px-4 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={uploadingFile}
                          className="px-5 py-2 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold disabled:opacity-50"
                        >
                          {uploadingFile
                            ? 'Saving...'
                            : replacingMediaFile
                            ? 'Replace File & Save'
                            : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Real Multipart File Upload Modal */}
              {uploadModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-extrabold text-[#0B0E29]">
                        Upload Media File
                      </h3>
                      <button
                        type="button"
                        onClick={() => setUploadModalOpen(false)}
                        className="p-1.5 text-brand-muted hover:text-[#0B0E29]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleUploadSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1.5">
                          Select Image or Document (Max 10 MB) *
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          required
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            setSelectedUploadFile(f);
                            if (f && !uploadTitle) {
                              setUploadTitle(f.name.replace(/\.[^/.]+$/, ''));
                            }
                          }}
                          className="w-full rounded-xl border border-brand-border p-2.5 text-xs text-[#0B0E29] bg-[#FAF9F5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Asset Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          placeholder="e.g., Veterinary Cold-Chain Warehouse"
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Category
                        </label>
                        <select
                          value={uploadCategory}
                          onChange={(e) =>
                            setUploadCategory(
                              e.target.value as MediaAssetItem['category']
                            )
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29] bg-white"
                        >
                          <option value="Hero & Office">Hero &amp; Office</option>
                          <option value="Logo & Brand">Logo &amp; Brand</option>
                          <option value="Leadership">Leadership</option>
                          <option value="Strategy">Strategy</option>
                          <option value="Products">Products</option>
                          <option value="Document">Document</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Alt Text (Accessibility)
                        </label>
                        <input
                          type="text"
                          value={uploadAltText}
                          onChange={(e) => setUploadAltText(e.target.value)}
                          placeholder="Descriptive alt text for screen readers"
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setUploadModalOpen(false)}
                          className="px-4 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={uploadingFile}
                          className="px-5 py-2 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold disabled:opacity-50"
                        >
                          {uploadingFile ? 'Uploading...' : 'Upload & Save'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* 7. ORBIT ASSISTANT & WHATSAPP MODULE */}
          {/* ========================================== */}
          {activeModule === 'orbit-assistant' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 5 Cols: WhatsApp & Assistant Configuration */}
              <div className="lg:col-span-5 bg-white rounded-[24px] border border-brand-border/80 p-6 space-y-4 shadow-2xs">
                <div>
                  <h3 className="font-heading text-base font-extrabold text-[#0B0E29]">
                    Orbit Assistant &amp; WhatsApp Settings
                  </h3>
                  <p className="text-xs text-brand-muted">
                    Configure welcome message and WhatsApp direct link
                  </p>
                </div>

                <form onSubmit={handleSaveOrbitConfig} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                      Assistant Display Name
                    </label>
                    <input
                      type="text"
                      value={orbitConfig.assistantName}
                      onChange={(e) =>
                        setOrbitConfig({
                          ...orbitConfig,
                          assistantName: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                      WhatsApp Business Number
                    </label>
                    <input
                      type="text"
                      value={orbitConfig.whatsappNumber}
                      onChange={(e) =>
                        setOrbitConfig({
                          ...orbitConfig,
                          whatsappNumber: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                      WhatsApp Prefilled Inquiry Message
                    </label>
                    <textarea
                      rows={3}
                      value={orbitConfig.whatsappPrefilledMessage}
                      onChange={(e) =>
                        setOrbitConfig({
                          ...orbitConfig,
                          whatsappPrefilledMessage: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                      Welcome Greeting Message
                    </label>
                    <textarea
                      rows={3}
                      value={orbitConfig.welcomeMessage}
                      onChange={(e) =>
                        setOrbitConfig({
                          ...orbitConfig,
                          welcomeMessage: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                    />
                  </div>

                  {canDo('orbit-assistant', 'edit') && (
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                    >
                      Save Assistant Settings
                    </button>
                  )}
                </form>
              </div>

              {/* Right 7 Cols: Knowledge Base FAQs */}
              <div className="lg:col-span-7 bg-white rounded-[24px] border border-brand-border/80 p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-base font-extrabold text-[#0B0E29]">
                      Knowledge Base &amp; FAQ Responses ({orbitFaqs.length})
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Synced directly to the public Orbit Assistant chatbot
                    </p>
                  </div>
                  {canDo('orbit-assistant', 'create') && (
                    <button
                      type="button"
                      onClick={openNewFaqModal}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                  {orbitFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-brand-border/70 p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-heading font-bold uppercase text-brand-orange">
                            {faq.category}
                          </span>
                          <h4 className="font-heading text-xs font-extrabold text-[#0B0E29]">
                            {faq.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          {canDo('orbit-assistant', 'edit') && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFaq({ ...faq });
                                setFaqKeywordsText(faq.keywords.join(', '));
                                setFaqModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-brand-border text-[#0B0E29] hover:bg-[#FAF9F5]"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDo('orbit-assistant', 'delete') && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDialog({
                                  label: faq.title,
                                  onConfirm: async () => {
                                    await dispatchStoreMutation(
                                      'deleteOrbitFaq',
                                      { id: faq.id }
                                    );
                                    showToast('FAQ entry deleted.');
                                  },
                                })
                              }
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-brand-body whitespace-pre-wrap line-clamp-3">
                        {faq.answer}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {faq.keywords.slice(0, 8).map((kw: string) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 rounded bg-[#FAF9F5] text-[10px] text-brand-muted font-mono"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {faqModalOpen && editingFaq && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-extrabold text-[#0B0E29]">
                        {orbitFaqs.some((f) => f.id === editingFaq.id)
                          ? 'Edit Orbit FAQ Entry'
                          : 'Add Orbit FAQ Entry'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setFaqModalOpen(false)}
                        className="p-1.5 text-brand-muted hover:text-[#0B0E29]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveFaq} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Topic Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingFaq.title}
                          onChange={(e) =>
                            setEditingFaq({
                              ...editingFaq,
                              title: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Trigger Keywords (comma-separated) *
                        </label>
                        <input
                          type="text"
                          required
                          value={faqKeywordsText}
                          onChange={(e) => setFaqKeywordsText(e.target.value)}
                          placeholder="vaccines, cold chain, poultry, dosage"
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Grounded Response Answer *
                        </label>
                        <textarea
                          rows={5}
                          required
                          value={editingFaq.answer}
                          onChange={(e) =>
                            setEditingFaq({
                              ...editingFaq,
                              answer: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setFaqModalOpen(false)}
                          className="px-4 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold"
                        >
                          Save FAQ
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* 8. SEO MANAGEMENT MODULE */}
          {/* ========================================== */}
          {activeModule === 'seo' && (
            <div className="space-y-5">
              <div className="bg-white rounded-[24px] border border-brand-border/80 p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-base font-extrabold text-[#0B0E29]">
                    SEO &amp; Social Metadata Management ({seoList.length} routes)
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Manage page titles, meta descriptions, canonical URLs, and OpenGraph tags
                  </p>
                </div>
                {canDo('seo', 'create') && (
                  <button
                    type="button"
                    onClick={openNewSeoModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Route SEO</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {seoList.map((seo) => (
                  <div
                    key={seo.id}
                    className="bg-white rounded-[24px] border border-brand-border/80 p-6 space-y-3 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-[#0B0E29] text-white font-mono text-xs font-bold">
                          {seo.route}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          {seo.indexStatus}
                        </span>
                      </div>
                      <div className="font-heading text-sm font-extrabold text-[#0B0E29] pt-1">
                        {seo.metaTitle}
                      </div>
                      <p className="text-xs text-brand-body">
                        {seo.metaDescription}
                      </p>
                      <div className="text-[11px] text-brand-muted font-mono truncate">
                        Canonical: {seo.canonicalUrl}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-brand-muted">
                        Updated: {seo.lastUpdated}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {canDo('seo', 'edit') && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSeo({ ...seo });
                              setSeoModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-brand-border font-heading font-bold text-[#0B0E29] hover:bg-[#FAF9F5]"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit SEO</span>
                          </button>
                        )}
                        {canDo('seo', 'delete') && (
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDialog({
                                label: `SEO config for ${seo.route}`,
                                onConfirm: async () => {
                                  await dispatchStoreMutation('deleteSeo', {
                                    id: seo.id,
                                  });
                                  showToast('SEO config deleted.');
                                },
                              })
                            }
                            className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {seoModalOpen && editingSeo && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-[24px] max-w-xl w-full p-6 space-y-4 shadow-xl my-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-extrabold text-[#0B0E29]">
                        Configure Page SEO &amp; Canonical Metadata
                      </h3>
                      <button
                        type="button"
                        onClick={() => setSeoModalOpen(false)}
                        className="p-1.5 text-brand-muted hover:text-[#0B0E29]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveSeo} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Route Path *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingSeo.route}
                            onChange={(e) =>
                              setEditingSeo({
                                ...editingSeo,
                                route: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Page Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingSeo.pageName}
                            onChange={(e) =>
                              setEditingSeo({
                                ...editingSeo,
                                pageName: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Meta Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingSeo.metaTitle}
                          onChange={(e) =>
                            setEditingSeo({
                              ...editingSeo,
                              metaTitle: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Meta Description *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={editingSeo.metaDescription}
                          onChange={(e) =>
                            setEditingSeo({
                              ...editingSeo,
                              metaDescription: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Canonical URL *
                          </label>
                          <input
                            type="url"
                            required
                            value={editingSeo.canonicalUrl}
                            onChange={(e) =>
                              setEditingSeo({
                                ...editingSeo,
                                canonicalUrl: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                            Robots Indexing
                          </label>
                          <select
                            value={editingSeo.indexStatus}
                            onChange={(e) =>
                              setEditingSeo({
                                ...editingSeo,
                                indexStatus: e.target
                                  .value as SeoPageConfig['indexStatus'],
                              })
                            }
                            className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29] bg-white"
                          >
                            <option value="index, follow">index, follow</option>
                            <option value="noindex, nofollow">
                              noindex, nofollow
                            </option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                          Keywords
                        </label>
                        <input
                          type="text"
                          value={editingSeo.keywords}
                          onChange={(e) =>
                            setEditingSeo({
                              ...editingSeo,
                              keywords: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
                        />
                      </div>

                      <ImageUploadPicker
                        label="OpenGraph Social Share Image"
                        value={editingSeo.ogImage}
                        onChange={(newUrl) =>
                          setEditingSeo({
                            ...editingSeo,
                            ogImage: newUrl,
                          })
                        }
                        category="Hero & Office"
                        defaultTitle={`${editingSeo.pageName || 'Page'} Social Image`}
                        mediaLibrary={mediaList}
                        onMediaUploaded={(_, updatedMedia) =>
                          setMediaList(updatedMedia)
                        }
                        previewHeightClass="h-36"
                      />

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSeoModalOpen(false)}
                          className="px-4 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold"
                        >
                          Save SEO Metadata
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* 9. USER MANAGEMENT + RBAC SUB-MODULE */}
          {/* ========================================== */}
          {activeModule === 'users' && (
            <UserManagementModule
              currentUser={currentUser}
              users={usersList}
              roles={rolesList}
              onRefreshStore={dispatchStoreMutation}
              onNotify={showToast}
              onConfirmDelete={(label, onConfirm) =>
                setConfirmDialog({ label, onConfirm })
              }
            />
          )}

          {/* ========================================== */}
          {/* 10. SUPPORT MODULE (ORBIT SUPPORT DESK) */}
          {/* ========================================== */}
          {activeModule === 'support' && (
            <SupportDeskModule
              currentUser={currentUser}
              supportTickets={supportTickets}
              smtpStatus={smtpStatus}
              onTicketSubmitted={(tickets, logs) => {
                setSupportTickets(tickets);
                if (Array.isArray(logs)) {
                  setAuditLogs(logs as AuditLogEntry[]);
                }
              }}
              onNotify={showToast}
            />
          )}
        </div>
      </div>
    </div>
  );
}
