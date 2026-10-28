'use client';

import React, { useMemo, useState } from 'react';
import {
  Users,
  Eye,
  MessageSquare,
  FileText,
  Calendar,
  ChevronDown,
  ChevronRight,
  Mail,
  Package,
  Image as ImageIcon,
  UserPlus,
  Smartphone,
  Monitor,
  Tablet as TabletIcon,
  Headphones,
  Activity,
  X,
  Search,
  TrendingUp,
  TrendingDown,
  ExternalLink,
} from 'lucide-react';
import {
  AdminModuleId,
  AdminNewsPost,
  AdminUserRecord,
  AnalyticsSummaryData,
  AuditLogEntry,
  ContactInquiryItem,
  MediaAssetItem,
} from '@/types/admin';
import { ProductItem } from '@/types';
import {
  AnalyticsDaysRange,
  GlobalVisitorMap,
} from '@/components/admin/GlobalVisitorMap';

interface DashboardOverviewSectionProps {
  adminName: string;
  analytics: AnalyticsSummaryData;
  selectedDays: AnalyticsDaysRange;
  customDateRange: { startDate: string; endDate: string } | null;
  onSelectDays: (days: AnalyticsDaysRange) => void;
  onApplyCustomDateRange: (startDate: string, endDate: string) => void;
  inquiries: ContactInquiryItem[];
  newsList: AdminNewsPost[];
  products: ProductItem[];
  mediaList: MediaAssetItem[];
  usersList: AdminUserRecord[];
  auditLogs: AuditLogEntry[];
  onNavigateModule: (mod: AdminModuleId) => void;
  onQuickAddNews: () => void;
  onQuickAddProduct: () => void;
  onQuickUploadMedia: () => void;
}

/**
 * Generates a smooth cubic bezier SVG path through a list of [x, y] points.
 */
function buildSmoothPath(points: [number, number][]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0][0]},${points[0][1]}`;
  let path = `M ${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const cpx1 = x0 + (x1 - x0) * 0.45;
    const cpy1 = y0;
    const cpx2 = x0 + (x1 - x0) * 0.55;
    const cpy2 = y1;
    path += ` C ${cpx1.toFixed(1)},${cpy1.toFixed(1)} ${cpx2.toFixed(1)},${cpy2.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return path;
}

/**
 * Mini Area Sparkline for KPI Cards
 */
function KpiSparkline({
  values,
  strokeColor,
  gradientId,
}: {
  values: number[];
  strokeColor: string;
  gradientId: string;
}) {
  const width = 112;
  const height = 52;
  const padY = 6;

  const points = useMemo<[number, number][]>(() => {
    const safe = values.length >= 2 ? values : [0, 0];
    const min = Math.min(...safe);
    const max = Math.max(...safe);
    const range = max - min;
    return safe.map((v, idx) => {
      const x = (idx / (safe.length - 1)) * width;
      const y =
        range === 0
          ? height - padY - 6
          : height - padY - ((v - min) / range) * (height - padY * 2);
      return [x, y];
    });
  }, [values]);

  const linePath = useMemo(() => buildSmoothPath(points), [points]);
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    return `${linePath} L ${width},${height} L 0,${height} Z`;
  }, [linePath, points.length]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-24 sm:w-28 h-13 shrink-0 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.24" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Formats a timestamp or date string into a human-friendly relative time label
 */
function formatRelativeTime(dateStr: string): string {
  const normalized = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
  const parsed = new Date(normalized).getTime();
  if (Number.isNaN(parsed)) {
    return dateStr || 'Recently';
  }
  const diffMs = Date.now() - parsed;
  if (diffMs < 0) return 'Just now';
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 2) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays <= 30) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
  return new Date(parsed).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats Y-axis numbers cleanly (e.g. 2000 -> 2K)
 */
function formatAxisValue(val: number): string {
  if (val === 0) return '0';
  if (val >= 1000) {
    const k = val / 1000;
    return Number.isInteger(k) ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return String(Math.round(val));
}

export function DashboardOverviewSection({
  adminName,
  analytics,
  selectedDays,
  customDateRange,
  onSelectDays,
  onApplyCustomDateRange,
  inquiries,
  newsList,
  products,
  mediaList,
  usersList,
  auditLogs,
  onNavigateModule,
  onQuickAddNews,
  onQuickAddProduct,
  onQuickUploadMedia,
}: DashboardOverviewSectionProps) {
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [startInput, setStartInput] = useState(
    customDateRange?.startDate || analytics.periodStart || ''
  );
  const [endInput, setEndInput] = useState(
    customDateRange?.endDate || analytics.periodEnd || ''
  );
  const [hoveredTrafficIdx, setHoveredTrafficIdx] = useState<number | null>(
    null
  );
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState<string>('all');

  const firstName = useMemo(() => {
    if (!adminName) return 'Admin';
    if (adminName.toLowerCase().includes('administrator')) return 'Admin';
    return adminName.split(' ')[0] || 'Admin';
  }, [adminName]);

  // Sparkline series from real daily traffic (last 8 points)
  const visitorSparkValues = useMemo(() => {
    const slice = analytics.dailyTraffic.slice(-8).map((d) => d.visitors);
    return slice.length >= 2 ? slice : [0, 0];
  }, [analytics.dailyTraffic]);

  const pageViewSparkValues = useMemo(() => {
    const slice = analytics.dailyTraffic.slice(-8).map((d) => d.pageViews);
    return slice.length >= 2 ? slice : [0, 0];
  }, [analytics.dailyTraffic]);

  const inquirySparkValues = useMemo(() => {
    const days = analytics.dailyTraffic.slice(-8);
    if (days.length < 2) return [0, inquiries.length];
    return days.map(
      (d) => inquiries.filter((inq) => (inq.date || '').startsWith(d.date)).length
    );
  }, [analytics.dailyTraffic, inquiries]);

  const inquiriesChangePct = useMemo(() => {
    if (!analytics.periodStart || !analytics.periodEnd) {
      return inquiries.length > 0 ? 100 : 0;
    }
    const startMs = new Date(`${analytics.periodStart}T00:00:00.000Z`).getTime();
    const endMs = new Date(`${analytics.periodEnd}T23:59:59.999Z`).getTime();
    const durationMs = Math.max(24 * 60 * 60 * 1000, endMs - startMs);
    const prevStartMs = startMs - durationMs;

    let currentCount = 0;
    let prevCount = 0;
    for (const inq of inquiries) {
      const ts = new Date((inq.date || '').replace(' ', 'T')).getTime();
      if (Number.isNaN(ts)) continue;
      if (ts >= startMs && ts <= endMs) currentCount += 1;
      else if (ts >= prevStartMs && ts < startMs) prevCount += 1;
    }
    if (prevCount > 0) {
      return Number((((currentCount - prevCount) / prevCount) * 100).toFixed(1));
    }
    return currentCount > 0 ? 100 : 0;
  }, [inquiries, analytics.periodStart, analytics.periodEnd]);

  const publishedNewsCount = useMemo(
    () => newsList.filter((n) => n.status === 'Published').length,
    [newsList]
  );

  const newsPublishedPct = useMemo(() => {
    if (newsList.length === 0) return 0;
    return Number(((publishedNewsCount / newsList.length) * 100).toFixed(1));
  }, [newsList.length, publishedNewsCount]);

  const newsSparkValues = useMemo(() => {
    const days = analytics.dailyTraffic.slice(-8);
    if (days.length < 2) return [0, publishedNewsCount];
    const auditNewsByDay = days.map(
      (d) =>
        auditLogs.filter(
          (log) => log.module === 'news' && (log.timestamp || '').startsWith(d.date)
        ).length
    );
    if (auditNewsByDay.some((v) => v > 0)) return auditNewsByDay;
    return days.map(() => publishedNewsCount);
  }, [analytics.dailyTraffic, auditLogs, publishedNewsCount]);

  // Real Recent Activities feed directly from live auditLogs and inquiries
  const recentActivities = useMemo(() => {
    const items: {
      id: string;
      title: string;
      subtitle: string;
      timeLabel: string;
      timestampMs: number;
      module: AdminModuleId;
      iconType: 'inbox' | 'news' | 'users' | 'products' | 'media';
    }[] = [];

    for (const log of auditLogs) {
      const tsMs = new Date(log.timestamp).getTime() || 0;
      let iconType: 'inbox' | 'news' | 'users' | 'products' | 'media' = 'users';
      let targetModule: AdminModuleId = 'dashboard';

      if (log.module === 'inbox') {
        iconType = 'inbox';
        targetModule = 'inbox';
      } else if (log.module === 'news') {
        iconType = 'news';
        targetModule = 'news';
      } else if (log.module === 'products') {
        iconType = 'products';
        targetModule = 'products';
      } else if (log.module === 'media') {
        iconType = 'media';
        targetModule = 'media';
      } else if (log.module === 'teams') {
        iconType = 'users';
        targetModule = 'teams';
      } else if (log.module === 'seo') {
        iconType = 'news';
        targetModule = 'seo';
      } else if (log.module === 'support') {
        iconType = 'inbox';
        targetModule = 'support';
      } else if (log.module === 'users' || log.module === 'auth') {
        iconType = 'users';
        targetModule = 'users';
      }

      items.push({
        id: `log-${log.id}`,
        title: log.action,
        subtitle: log.target || log.actorEmail,
        timeLabel: formatRelativeTime(log.timestamp),
        timestampMs: tsMs,
        module: targetModule,
        iconType,
      });
    }

    return items
      .sort((a, b) => b.timestampMs - a.timestampMs)
      .slice(0, 5);
  }, [auditLogs]);

  // Website Traffic Dual-Series SVG Chart Geometry
  const trafficChart = useMemo(() => {
    const series =
      analytics.dailyTraffic.length > 0
        ? analytics.dailyTraffic
        : [{ date: '2026-10-28', label: 'Oct 28', visitors: 0, pageViews: 0 }];

    const rawMax = Math.max(
      4,
      ...series.map((d) => Math.max(d.pageViews, d.visitors))
    );

    // Compute clean step ceiling divisible by 4 for integer Y-axis ticks
    let ceilStep = 4;
    if (rawMax <= 4) ceilStep = 4;
    else if (rawMax <= 8) ceilStep = 8;
    else if (rawMax <= 12) ceilStep = 12;
    else if (rawMax <= 20) ceilStep = 20;
    else if (rawMax <= 40) ceilStep = 40;
    else {
      const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
      const normalized = rawMax / magnitude;
      if (normalized <= 2) ceilStep = 2 * magnitude;
      else if (normalized <= 4) ceilStep = 4 * magnitude;
      else if (normalized <= 5) ceilStep = 5 * magnitude;
      else if (normalized <= 8) ceilStep = 8 * magnitude;
      else ceilStep = 10 * magnitude;
    }

    const yTicks = [
      ceilStep,
      ceilStep * 0.75,
      ceilStep * 0.5,
      ceilStep * 0.25,
      0,
    ];

    const width = 360;
    const height = 165;
    const padLeft = 34;
    const padRight = 10;
    const padTop = 10;
    const padBottom = 24;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const visitorPts: [number, number][] = series.map((d, idx) => {
      const x =
        padLeft +
        (series.length > 1 ? (idx / (series.length - 1)) * plotW : plotW / 2);
      const y = padTop + plotH - (d.visitors / ceilStep) * plotH;
      return [x, y];
    });

    const pageViewPts: [number, number][] = series.map((d, idx) => {
      const x =
        padLeft +
        (series.length > 1 ? (idx / (series.length - 1)) * plotW : plotW / 2);
      const y = padTop + plotH - (d.pageViews / ceilStep) * plotH;
      return [x, y];
    });

    const visitorLine = buildSmoothPath(visitorPts);
    const visitorArea =
      visitorPts.length > 0
        ? `${visitorLine} L ${visitorPts[visitorPts.length - 1][0].toFixed(1)},${
            padTop + plotH
          } L ${visitorPts[0][0].toFixed(1)},${padTop + plotH} Z`
        : '';

    const pageViewLine = buildSmoothPath(pageViewPts);
    const pageViewArea =
      pageViewPts.length > 0
        ? `${pageViewLine} L ${pageViewPts[pageViewPts.length - 1][0].toFixed(1)},${
            padTop + plotH
          } L ${pageViewPts[0][0].toFixed(1)},${padTop + plotH} Z`
        : '';

    // Pick 5 evenly spaced X labels
    const labelIndices: number[] = [];
    if (series.length <= 5) {
      for (let i = 0; i < series.length; i++) labelIndices.push(i);
    } else {
      for (let k = 0; k < 5; k++) {
        labelIndices.push(Math.round((k / 4) * (series.length - 1)));
      }
    }

    return {
      series,
      yTicks,
      width,
      height,
      padLeft,
      padRight,
      padTop,
      padBottom,
      plotW,
      plotH,
      visitorPts,
      pageViewPts,
      visitorLine,
      visitorArea,
      pageViewLine,
      pageViewArea,
      labelIndices,
    };
  }, [analytics.dailyTraffic]);

  // Traffic Sources Donut Segments
  const trafficSourceConfig = useMemo(() => {
    const palette: Record<string, string> = {
      'Organic Search': '#2563EB',
      Direct: '#F59E0B',
      'Social Media': '#EA580C',
      Referral: '#CA8A04',
      Email: '#7C3AED',
    };
    const order = [
      'Organic Search',
      'Direct',
      'Social Media',
      'Referral',
      'Email',
    ];
    const byName = new Map(
      analytics.trafficSources.map((s) => [s.source, s])
    );
    const items = order.map((name) => {
      const found = byName.get(name);
      return {
        source: name,
        count: found?.count || 0,
        visitors: found?.visitors || 0,
        share: found?.share || 0,
        color: palette[name] || '#64748B',
      };
    });

    const totalShare = items.reduce((acc, i) => acc + i.share, 0);
    const activeCount = items.filter((i) => i.share > 0).length;
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    let cumulative = 0;

    const segments = items.map((item) => {
      const normalizedFraction = totalShare > 0 ? item.share / totalShare : 0;
      const dashLength = normalizedFraction * circumference;
      const dashOffset = -cumulative * circumference;
      cumulative += normalizedFraction;
      const gap = activeCount > 1 && dashLength > 0 ? 1.5 : 0;
      return {
        ...item,
        dashArray: `${Math.max(0, dashLength - gap)} ${circumference}`,
        dashOffset,
      };
    });

    return { radius, circumference, segments };
  }, [analytics.trafficSources]);

  // Device Breakdown Donut Segments
  const deviceConfig = useMemo(() => {
    const palette: Record<'Mobile' | 'Desktop' | 'Tablet', string> = {
      Mobile: '#2563EB',
      Desktop: '#60A5FA',
      Tablet: '#818CF8',
    };
    const order: ('Mobile' | 'Desktop' | 'Tablet')[] = [
      'Mobile',
      'Desktop',
      'Tablet',
    ];
    const byDevice = new Map(
      analytics.deviceBreakdown.map((d) => [d.device, d])
    );
    const items = order.map((dev) => {
      const found = byDevice.get(dev);
      return {
        device: dev,
        count: found?.count || 0,
        visitors: found?.visitors || 0,
        percentage: found?.percentage || 0,
        color: palette[dev],
      };
    });

    const dominant = [...items].sort((a, b) => b.percentage - a.percentage)[0] || {
      device: 'Desktop',
      percentage: 0,
    };

    const totalPct = items.reduce((acc, i) => acc + i.percentage, 0);
    const activeCount = items.filter((i) => i.percentage > 0).length;
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    let cumulative = 0;

    const segments = items.map((item) => {
      const frac = totalPct > 0 ? item.percentage / totalPct : 0;
      const dashLength = frac * circumference;
      const dashOffset = -cumulative * circumference;
      cumulative += frac;
      const gap = activeCount > 1 && dashLength > 0 ? 1.5 : 0;
      return {
        ...item,
        dashArray: `${Math.max(0, dashLength - gap)} ${circumference}`,
        dashOffset,
      };
    });

    return { radius, circumference, segments, dominant };
  }, [analytics.deviceBreakdown]);

  // Filtered audit logs for the "View All" modal
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (auditModuleFilter !== 'all' && log.module !== auditModuleFilter) {
        return false;
      }
      const q = auditSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.actorEmail.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q)
      );
    });
  }, [auditLogs, auditModuleFilter, auditSearch]);

  return (
    <div className="space-y-5">
      {/* ========================================================= */}
      {/* WELCOME HEADER & INTERACTIVE DATE RANGE PICKER */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0B1938] flex items-center gap-2.5">
            <span className="text-2xl leading-none" role="img" aria-label="Wave">
              👋
            </span>
            <span>Welcome back, {firstName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here&apos;s what&apos;s happening with your website today.
          </p>
        </div>

        {/* Date Range Dropdown Selector */}
        <div className="relative self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setDateMenuOpen((o) => !o)}
            className="inline-flex items-center gap-3 bg-white hover:bg-slate-50/80 border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-2xs text-xs sm:text-sm font-medium text-[#0B1938] transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="tabular-nums font-semibold">
              {analytics.periodLabel || 'Last 30 Days'}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {dateMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setDateMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 z-40 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-3.5 space-y-3">
                <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400 px-1">
                  Preset Date Ranges
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {([
                    { days: 7 as AnalyticsDaysRange, label: 'Last 7 Days' },
                    { days: 30 as AnalyticsDaysRange, label: 'Last 30 Days' },
                    { days: 90 as AnalyticsDaysRange, label: 'Last 90 Days' },
                    { days: 365 as AnalyticsDaysRange, label: 'Last 365 Days' },
                  ] as const).map((preset) => {
                    const active =
                      !customDateRange && selectedDays === preset.days;
                    return (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => {
                          onSelectDays(preset.days);
                          setDateMenuOpen(false);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-heading font-bold text-left transition-colors ${
                          active
                            ? 'bg-[#0B1938] text-white'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-2">
                  <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400 px-1">
                    Custom Date Range
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        From
                      </label>
                      <input
                        type="date"
                        value={startInput}
                        onChange={(e) => setStartInput(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] text-[#0B1938]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        To
                      </label>
                      <input
                        type="date"
                        value={endInput}
                        onChange={(e) => setEndInput(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] text-[#0B1938]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (startInput && endInput) {
                        onApplyCustomDateRange(startInput, endInput);
                        setDateMenuOpen(false);
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-[#0B1938] text-xs font-heading font-bold transition-colors"
                  >
                    Apply Date Filter
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROW 1: 4 PRIMARY KPI CARDS WITH SPARKLINES */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Total Visitors */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex items-center justify-between gap-3 hover:border-blue-200 transition-colors">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                Total Visitors
              </span>
            </div>
            <div className="font-heading text-2xl sm:text-[28px] font-extrabold text-[#0B1938] leading-none tabular-nums pt-0.5">
              {analytics.uniqueVisitors.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  analytics.visitorsChangePct >= 0
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {analytics.visitorsChangePct >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {analytics.visitorsChangePct >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(analytics.visitorsChangePct).toFixed(1)}%
              </span>
              <span className="text-slate-400">vs. previous period</span>
            </div>
          </div>
          <KpiSparkline
            values={visitorSparkValues}
            strokeColor="#2563EB"
            gradientId="spark-visitors"
          />
        </div>

        {/* KPI 2: Page Views */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex items-center justify-between gap-3 hover:border-purple-200 transition-colors">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                Page Views
              </span>
            </div>
            <div className="font-heading text-2xl sm:text-[28px] font-extrabold text-[#0B1938] leading-none tabular-nums pt-0.5">
              {analytics.totalPageViews.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  analytics.pageViewsChangePct >= 0
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {analytics.pageViewsChangePct >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {analytics.pageViewsChangePct >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(analytics.pageViewsChangePct).toFixed(1)}%
              </span>
              <span className="text-slate-400">vs. previous period</span>
            </div>
          </div>
          <KpiSparkline
            values={pageViewSparkValues}
            strokeColor="#8B5CF6"
            gradientId="spark-pageviews"
          />
        </div>

        {/* KPI 3: Total Inquiries */}
        <div
          onClick={() => onNavigateModule('inbox')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigateModule('inbox')}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex items-center justify-between gap-3 hover:border-emerald-200 transition-colors cursor-pointer"
        >
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                Total Inquiries
              </span>
            </div>
            <div className="font-heading text-2xl sm:text-[28px] font-extrabold text-[#0B1938] leading-none tabular-nums pt-0.5">
              {inquiries.length.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  inquiriesChangePct >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {inquiriesChangePct >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {inquiriesChangePct >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(inquiriesChangePct).toFixed(1)}%
              </span>
              <span className="text-slate-400">vs. previous period</span>
            </div>
          </div>
          <KpiSparkline
            values={inquirySparkValues}
            strokeColor="#10B981"
            gradientId="spark-inquiries"
          />
        </div>

        {/* KPI 4: News Articles */}
        <div
          onClick={() => onNavigateModule('news')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigateModule('news')}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex items-center justify-between gap-3 hover:border-amber-200 transition-colors cursor-pointer"
        >
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                News Articles
              </span>
            </div>
            <div className="font-heading text-2xl sm:text-[28px] font-extrabold text-[#0B1938] leading-none tabular-nums pt-0.5">
              {newsList.length.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                {publishedNewsCount}/{newsList.length} ({newsPublishedPct}%)
              </span>
              <span className="text-slate-400">published live</span>
            </div>
          </div>
          <KpiSparkline
            values={newsSparkValues}
            strokeColor="#F59E0B"
            gradientId="spark-news"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROW 2: GLOBAL VISITOR MAP (8 COLS) + RECENT ACTIVITIES (4 COLS) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-8">
          <GlobalVisitorMap
            countryStats={analytics.countryStats}
            totalPageViews={analytics.totalPageViews}
            uniqueVisitors={analytics.uniqueVisitors}
            selectedDays={selectedDays}
            onSelectDays={onSelectDays}
          />
        </div>

        {/* Right: Recent Activities Card */}
        <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0B1938] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-base font-extrabold text-[#0B1938]">
                  Recent Activities
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAuditModalOpen(true)}
                className="text-xs font-heading font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100 pt-1">
              {recentActivities.map((act) => {
                let badgeClass = 'bg-emerald-50 text-emerald-600';
                let IconComp: React.ComponentType<{ className?: string }> = Mail;
                if (act.iconType === 'news') {
                  badgeClass = 'bg-blue-50 text-blue-600';
                  IconComp = FileText;
                } else if (act.iconType === 'users') {
                  badgeClass = 'bg-indigo-50 text-indigo-600';
                  IconComp = UserPlus;
                } else if (act.iconType === 'products') {
                  badgeClass = 'bg-amber-50 text-amber-500';
                  IconComp = Package;
                } else if (act.iconType === 'media') {
                  badgeClass = 'bg-sky-50 text-sky-600';
                  IconComp = ImageIcon;
                }

                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => onNavigateModule(act.module)}
                    className="w-full py-3.5 flex items-start justify-between gap-3 text-left hover:bg-slate-50/70 rounded-xl px-1.5 transition-colors group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${badgeClass}`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading text-xs sm:text-[13px] font-bold text-[#0B1938] group-hover:text-blue-700 transition-colors truncate">
                          {act.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {act.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 pt-0.5">
                      {act.timeLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROW 3: WEBSITE TRAFFIC + TRAFFIC SOURCES + DEVICE BREAKDOWN + QUICK ACTIONS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 items-stretch">
        {/* 1. Website Traffic (Dual Line & Area Chart) */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="font-heading text-sm sm:text-base font-extrabold text-[#0B1938]">
                Website Traffic
              </h3>
              <p className="text-[11px] text-slate-400">
                Last {selectedDays} days
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 pt-0.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                <span>Visitors</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span>Page Views</span>
              </span>
            </div>
          </div>

          <div className="relative my-auto">
            <svg
              viewBox={`0 0 ${trafficChart.width} ${trafficChart.height}`}
              className="w-full h-44 overflow-visible select-none"
              onMouseLeave={() => setHoveredTrafficIdx(null)}
            >
              <defs>
                <linearGradient id="traffic-visitors-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="traffic-views-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines & Y-axis Labels */}
              {trafficChart.yTicks.map((tickVal, idx) => {
                const y =
                  trafficChart.padTop +
                  (idx / (trafficChart.yTicks.length - 1)) * trafficChart.plotH;
                return (
                  <g key={`ytick-${idx}`}>
                    <line
                      x1={trafficChart.padLeft}
                      y1={y}
                      x2={trafficChart.width - trafficChart.padRight}
                      y2={y}
                      stroke="#F1F5F9"
                      strokeWidth="1"
                    />
                    <text
                      x={trafficChart.padLeft - 6}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-slate-400 text-[9px] font-medium"
                    >
                      {formatAxisValue(tickVal)}
                    </text>
                  </g>
                );
              })}

              {/* Area & Smooth Curves */}
              <path d={trafficChart.pageViewArea} fill="url(#traffic-views-grad)" />
              <path d={trafficChart.visitorArea} fill="url(#traffic-visitors-grad)" />

              <path
                d={trafficChart.pageViewLine}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={trafficChart.visitorLine}
                fill="none"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover Crosshair & Points */}
              {hoveredTrafficIdx !== null &&
                trafficChart.visitorPts[hoveredTrafficIdx] &&
                trafficChart.pageViewPts[hoveredTrafficIdx] && (
                  <g>
                    <line
                      x1={trafficChart.visitorPts[hoveredTrafficIdx][0]}
                      y1={trafficChart.padTop}
                      x2={trafficChart.visitorPts[hoveredTrafficIdx][0]}
                      y2={trafficChart.padTop + trafficChart.plotH}
                      stroke="#CBD5E1"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <circle
                      cx={trafficChart.pageViewPts[hoveredTrafficIdx][0]}
                      cy={trafficChart.pageViewPts[hoveredTrafficIdx][1]}
                      r="3.5"
                      fill="#F59E0B"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={trafficChart.visitorPts[hoveredTrafficIdx][0]}
                      cy={trafficChart.visitorPts[hoveredTrafficIdx][1]}
                      r="3.5"
                      fill="#2563EB"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

              {/* X-Axis Date Labels */}
              {trafficChart.labelIndices.map((sIdx) => {
                const item = trafficChart.series[sIdx];
                const pt = trafficChart.visitorPts[sIdx];
                if (!item || !pt) return null;
                return (
                  <text
                    key={`xlabel-${sIdx}`}
                    x={pt[0]}
                    y={trafficChart.height - 6}
                    textAnchor="middle"
                    className="fill-slate-400 text-[9px] font-medium"
                  >
                    {item.label}
                  </text>
                );
              })}

              {/* Invisible Hover Columns */}
              {trafficChart.series.map((_, idx) => {
                const colW =
                  trafficChart.plotW / Math.max(1, trafficChart.series.length);
                const x = trafficChart.padLeft + idx * colW;
                return (
                  <rect
                    key={`hit-${idx}`}
                    x={x}
                    y={trafficChart.padTop}
                    width={colW}
                    height={trafficChart.plotH}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoveredTrafficIdx(idx)}
                  />
                );
              })}
            </svg>

            {/* Floating Hover Tooltip */}
            {hoveredTrafficIdx !== null &&
              trafficChart.series[hoveredTrafficIdx] && (
                <div className="absolute top-1 left-10 z-20 bg-[#0B1938] text-white rounded-lg px-2.5 py-1.5 text-[10px] shadow-md pointer-events-none flex items-center gap-3">
                  <span className="font-bold text-slate-200">
                    {trafficChart.series[hoveredTrafficIdx].label}
                  </span>
                  <span className="text-blue-300">
                    Visitors:{' '}
                    <strong>
                      {trafficChart.series[
                        hoveredTrafficIdx
                      ].visitors.toLocaleString()}
                    </strong>
                  </span>
                  <span className="text-amber-300">
                    Views:{' '}
                    <strong>
                      {trafficChart.series[
                        hoveredTrafficIdx
                      ].pageViews.toLocaleString()}
                    </strong>
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* 2. Traffic Sources (Multi-Segment Donut + Legend) */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-sm sm:text-base font-extrabold text-[#0B1938]">
              Traffic Sources
            </h3>
            <p className="text-[11px] text-slate-400">
              Last {selectedDays} days
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 my-auto py-2">
            {/* SVG Donut Chart */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
              <svg
                viewBox="0 0 110 110"
                className="w-full h-full -rotate-90"
                role="img"
                aria-label="Traffic Sources Donut Chart"
              >
                <circle
                  cx="55"
                  cy="55"
                  r={trafficSourceConfig.radius}
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="14"
                />
                {trafficSourceConfig.segments.map((seg) => (
                  <circle
                    key={seg.source}
                    cx="55"
                    cy="55"
                    r={trafficSourceConfig.radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="14"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    className="transition-all duration-300"
                  >
                    <title>
                      {seg.source}: {seg.share.toFixed(1)}% ({seg.count.toLocaleString()} hits)
                    </title>
                  </circle>
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-heading text-sm sm:text-base font-extrabold text-[#0B1938] leading-none tabular-nums">
                  {analytics.uniqueVisitors.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                  Total Visitors
                </span>
              </div>
            </div>

            {/* Source Breakdown Legend */}
            <div className="flex-1 space-y-2 min-w-0">
              {trafficSourceConfig.segments.map((seg) => (
                <div
                  key={seg.source}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="text-slate-600 truncate text-[11px] sm:text-xs">
                      {seg.source}
                    </span>
                  </div>
                  <span className="font-semibold text-[#0B1938] text-[11px] sm:text-xs tabular-nums">
                    {seg.share.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Device Breakdown (Donut Ring + Device Icons) */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-sm sm:text-base font-extrabold text-[#0B1938]">
              Device Breakdown
            </h3>
            <p className="text-[11px] text-slate-400">
              Last {selectedDays} days
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 my-auto py-2">
            {/* SVG Ring Chart */}
            <div className="relative w-28 h-28 sm:w-30 sm:h-30 shrink-0 flex items-center justify-center">
              <svg
                viewBox="0 0 104 104"
                className="w-full h-full -rotate-90"
                role="img"
                aria-label="Device Breakdown Chart"
              >
                <circle
                  cx="52"
                  cy="52"
                  r={deviceConfig.radius}
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="10"
                />
                {deviceConfig.segments.map((seg) => (
                  <circle
                    key={seg.device}
                    cx="52"
                    cy="52"
                    r={deviceConfig.radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    className="transition-all duration-300"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-heading text-lg font-extrabold text-[#0B1938] leading-none tabular-nums">
                  {Math.round(deviceConfig.dominant.percentage)}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                  {deviceConfig.dominant.device}
                </span>
              </div>
            </div>

            {/* Device List */}
            <div className="flex-1 space-y-3 min-w-0">
              {deviceConfig.segments.map((seg) => {
                const DevIcon =
                  seg.device === 'Mobile'
                    ? Smartphone
                    : seg.device === 'Desktop'
                    ? Monitor
                    : TabletIcon;
                return (
                  <div
                    key={seg.device}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <DevIcon
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: seg.color }}
                      />
                      <span className="text-slate-600 truncate text-[11px] sm:text-xs">
                        {seg.device}
                      </span>
                    </div>
                    <span className="font-semibold text-[#0B1938] text-[11px] sm:text-xs tabular-nums">
                      {seg.percentage.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Quick Actions & Support Card */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-heading text-sm sm:text-base font-extrabold text-[#0B1938] mb-3">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onQuickAddNews}
                className="flex items-center justify-between gap-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 px-3 py-2.5 text-left transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-heading font-bold text-[#0B1938] truncate">
                    Add News
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={onQuickAddProduct}
                className="flex items-center justify-between gap-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 px-3 py-2.5 text-left transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-heading font-bold text-[#0B1938] truncate">
                    Add Product
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={onQuickUploadMedia}
                className="flex items-center justify-between gap-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 px-3 py-2.5 text-left transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-heading font-bold text-[#0B1938] truncate">
                    Upload Media
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateModule('users')}
                className="flex items-center justify-between gap-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 px-3 py-2.5 text-left transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-heading font-bold text-[#0B1938] truncate">
                    Manage Users
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            </div>
          </div>

          {/* Need Help? Support Banner */}
          <div className="rounded-xl bg-[#F4F7FB] border border-slate-200/70 p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-100/80 text-[#0B1938] flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-heading text-xs font-extrabold text-[#0B1938] leading-tight">
                  Need Help?
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Contact support for assistance.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateModule('support')}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#0B1938] hover:bg-[#162B5B] text-white text-[11px] font-heading font-bold shrink-0 transition-colors"
            >
              <span>Contact Support</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FULL SYSTEM AUDIT LOGS & TOP PAGES MODAL (VIEW ALL) */}
      {/* ========================================================= */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0B1938] text-brand-orange flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-extrabold text-[#0B1938]">
                    System Activities &amp; Audit Logs
                  </h3>
                  <p className="text-xs text-slate-400">
                    {auditLogs.length} recorded administrative &amp; visitor events
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    'all',
                    'auth',
                    'inbox',
                    'news',
                    'products',
                    'media',
                    'users',
                    'support',
                  ] as const
                ).map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setAuditModuleFilter(mod)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold uppercase transition-colors ${
                      auditModuleFilter === mod
                        ? 'bg-[#0B1938] text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Search actor, action, target..."
                  className="w-full rounded-xl bg-white border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-[#0B1938] focus:outline-none focus:border-[#0B1938]"
                />
              </div>
            </div>

            {/* Popular Pages Summary Strip */}
            {analytics.popularPages.length > 0 && (
              <div className="px-6 py-3 border-b border-slate-100 bg-white">
                <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Top Visited Website Routes ({analytics.periodLabel})
                </div>
                <div className="flex flex-wrap gap-2">
                  {analytics.popularPages.slice(0, 6).map((pg) => (
                    <a
                      key={pg.path}
                      href={pg.path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-xs transition-colors"
                    >
                      <span className="font-mono font-bold text-[#0B1938]">
                        {pg.path}
                      </span>
                      <span className="text-slate-500">
                        {pg.views.toLocaleString()} views
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Audit Log Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-heading font-bold uppercase text-slate-400">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Actor</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp.slice(0, 19).replace('T', ' ')}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#0B1938]">
                        {log.actorName}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 uppercase text-[10px] font-heading font-bold">
                          {log.module}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#0B1938]">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {log.target}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

