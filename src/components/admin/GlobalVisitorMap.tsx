'use client';

import React, { useMemo, useState } from 'react';
import { Globe, Users, Plus, Minus, RotateCcw } from 'lucide-react';
import { VisitorCountryStat } from '@/types/admin';
import worldMapData from '@/data/worldMapLocations.json';

export type AnalyticsDaysRange = 7 | 30 | 90 | 365;

interface WorldMapLocation {
  code: string;
  name: string;
  cx: number;
  cy: number;
  path: string;
}

const WORLD_LOCATIONS = (worldMapData.locations || []) as WorldMapLocation[];

/**
 * Crisp inline SVG Country Flags so flags render identically across Windows, macOS, and mobile
 * (Windows browsers do not render Unicode regional indicator flag emojis).
 */
export function CountryFlag({
  code,
  className = 'w-4 h-3',
}: {
  code: string;
  className?: string;
}) {
  const upper = (code || '').toUpperCase();

  if (upper === 'OTHER' || upper === 'XX') {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-xs bg-blue-100 text-blue-700 font-bold text-[9px] shrink-0 ${className}`}
      >
        🌐
      </span>
    );
  }

  switch (upper) {
    case 'US':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="20" fill="#FFFFFF" />
          <path
            d="M0,0H28V1.54H0ZM0,3.08H28V4.62H0ZM0,6.15H28V7.69H0ZM0,9.23H28V10.77H0ZM0,12.31H28V13.85H0ZM0,15.38H28V16.92H0ZM0,18.46H28V20H0Z"
            fill="#D02F44"
          />
          <rect width="12" height="10.77" fill="#192F5D" />
          <g fill="#FFFFFF">
            <circle cx="2.5" cy="2.2" r="0.65" />
            <circle cx="6" cy="2.2" r="0.65" />
            <circle cx="9.5" cy="2.2" r="0.65" />
            <circle cx="4.2" cy="4.2" r="0.65" />
            <circle cx="7.8" cy="4.2" r="0.65" />
            <circle cx="2.5" cy="6.2" r="0.65" />
            <circle cx="6" cy="6.2" r="0.65" />
            <circle cx="9.5" cy="6.2" r="0.65" />
            <circle cx="4.2" cy="8.2" r="0.65" />
            <circle cx="7.8" cy="8.2" r="0.65" />
          </g>
        </svg>
      );
    case 'ET':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="6.67" y="0" fill="#078930" />
          <rect width="28" height="6.67" y="6.67" fill="#FCDD09" />
          <rect width="28" height="6.66" y="13.34" fill="#DA121A" />
          <circle cx="14" cy="10" r="4.5" fill="#0F47AF" />
          <circle cx="14" cy="10" r="2.6" fill="none" stroke="#FCDD09" strokeWidth="0.9" />
        </svg>
      );
    case 'DE':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="6.67" y="0" fill="#111111" />
          <rect width="28" height="6.67" y="6.67" fill="#DE0000" />
          <rect width="28" height="6.66" y="13.34" fill="#FFCE00" />
        </svg>
      );
    case 'GB':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="20" fill="#012169" />
          <path d="M0,0 L28,20 M28,0 L0,20" stroke="#FFFFFF" strokeWidth="3.5" />
          <path d="M0,0 L28,20 M28,0 L0,20" stroke="#C8102E" strokeWidth="1.6" />
          <path d="M14,0 V20 M0,10 H28" stroke="#FFFFFF" strokeWidth="5.5" />
          <path d="M14,0 V20 M0,10 H28" stroke="#C8102E" strokeWidth="3.2" />
        </svg>
      );
    case 'CA':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="20" fill="#FFFFFF" />
          <rect width="7" height="20" x="0" fill="#FF0000" />
          <rect width="7" height="20" x="21" fill="#FF0000" />
          <path
            d="M14,4 L15.5,7.5 L18.5,7 L16.5,10 L18,12 L14.6,12 L14.6,15.5 L13.4,15.5 L13.4,12 L10,12 L11.5,10 L9.5,7 L12.5,7.5 Z"
            fill="#FF0000"
          />
        </svg>
      );
    case 'IN':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="6.67" y="0" fill="#FF9933" />
          <rect width="28" height="6.67" y="6.67" fill="#FFFFFF" />
          <rect width="28" height="6.66" y="13.34" fill="#138808" />
          <circle cx="14" cy="10" r="2.4" fill="none" stroke="#000080" strokeWidth="1" />
          <circle cx="14" cy="10" r="0.8" fill="#000080" />
        </svg>
      );
    case 'NL':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="6.67" y="0" fill="#AE1C28" />
          <rect width="28" height="6.67" y="6.67" fill="#FFFFFF" />
          <rect width="28" height="6.66" y="13.34" fill="#21468B" />
        </svg>
      );
    case 'KE':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="20" fill="#FFFFFF" />
          <rect width="28" height="6" y="0" fill="#111111" />
          <rect width="28" height="6" y="7" fill="#BB0000" />
          <rect width="28" height="6" y="14" fill="#006600" />
          <ellipse cx="14" cy="10" rx="2.6" ry="4.5" fill="#BB0000" stroke="#FFFFFF" strokeWidth="0.7" />
        </svg>
      );
    case 'AE':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="6.67" y="0" fill="#00732F" />
          <rect width="28" height="6.67" y="6.67" fill="#FFFFFF" />
          <rect width="28" height="6.66" y="13.34" fill="#111111" />
          <rect width="7.5" height="20" x="0" fill="#FF0000" />
        </svg>
      );
    case 'CN':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="20" fill="#DE2910" />
          <circle cx="6" cy="6" r="2.3" fill="#FFDE00" />
          <circle cx="11" cy="3" r="0.8" fill="#FFDE00" />
          <circle cx="12.5" cy="5" r="0.8" fill="#FFDE00" />
          <circle cx="12" cy="7.5" r="0.8" fill="#FFDE00" />
          <circle cx="10" cy="9.5" r="0.8" fill="#FFDE00" />
        </svg>
      );
    case 'FR':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="9.33" height="20" x="0" fill="#002395" />
          <rect width="9.33" height="20" x="9.33" fill="#FFFFFF" />
          <rect width="9.34" height="20" x="18.66" fill="#ED2939" />
        </svg>
      );
    case 'IT':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="9.33" height="20" x="0" fill="#009246" />
          <rect width="9.33" height="20" x="9.33" fill="#FFFFFF" />
          <rect width="9.34" height="20" x="18.66" fill="#CE2B37" />
        </svg>
      );
    case 'SA':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="20" fill="#006C35" />
          <rect x="6" y="7" width="16" height="3" rx="1" fill="#FFFFFF" />
          <rect x="8" y="12" width="12" height="1.5" rx="0.7" fill="#FFFFFF" />
        </svg>
      );
    case 'ZA':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="10" y="0" fill="#E03C31" />
          <rect width="28" height="10" y="10" fill="#001489" />
          <path d="M0,0 L12,10 L0,20 Z" fill="#000000" />
          <path d="M0,2 L11,10 L0,18 M10,10 H28" stroke="#007749" strokeWidth="4" fill="none" />
        </svg>
      );
    case 'NG':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="9.33" height="20" x="0" fill="#008751" />
          <rect width="9.33" height="20" x="9.33" fill="#FFFFFF" />
          <rect width="9.34" height="20" x="18.66" fill="#008751" />
        </svg>
      );
    case 'EG':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="6.67" y="0" fill="#CE1126" />
          <rect width="28" height="6.67" y="6.67" fill="#FFFFFF" />
          <rect width="28" height="6.66" y="13.34" fill="#000000" />
          <circle cx="14" cy="10" r="1.6" fill="#C09300" />
        </svg>
      );
    case 'TR':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="20" fill="#E30A17" />
          <circle cx="12" cy="10" r="4.5" fill="#FFFFFF" />
          <circle cx="13.2" cy="10" r="3.6" fill="#E30A17" />
          <circle cx="17.2" cy="10" r="1.4" fill="#FFFFFF" />
        </svg>
      );
    case 'BR':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="20" fill="#009739" />
          <polygon points="14,2.5 25,10 14,17.5 3,10" fill="#FEDD00" />
          <circle cx="14" cy="10" r="3.8" fill="#012169" />
        </svg>
      );
    case 'AU':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] shadow-2xs shrink-0 ${className}`}>
          <rect width="28" height="20" fill="#00008B" />
          <rect width="12" height="10" fill="#012169" />
          <path d="M6,0 V10 M0,5 H12" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M6,0 V10 M0,5 H12" stroke="#C8102E" strokeWidth="1.4" />
          <circle cx="21" cy="6" r="1.2" fill="#FFFFFF" />
          <circle cx="19" cy="12" r="1.2" fill="#FFFFFF" />
          <circle cx="23" cy="14" r="1.2" fill="#FFFFFF" />
          <circle cx="6" cy="15" r="1.6" fill="#FFFFFF" />
        </svg>
      );
    case 'JP':
      return (
        <svg viewBox="0 0 28 20" className={`rounded-[2px] border border-slate-200 shrink-0 ${className}`}>
          <rect width="28" height="20" fill="#FFFFFF" />
          <circle cx="14" cy="10" r="5" fill="#BC002D" />
        </svg>
      );
    default:
      return (
        <span
          className={`inline-flex items-center justify-center rounded-[2px] bg-blue-600 text-white font-bold text-[8px] uppercase shrink-0 ${className}`}
        >
          {upper.slice(0, 2)}
        </span>
      );
  }
}

interface GlobalVisitorMapProps {
  countryStats: VisitorCountryStat[];
  totalPageViews: number;
  uniqueVisitors: number;
  selectedDays: AnalyticsDaysRange;
  onSelectDays: (days: AnalyticsDaysRange) => void;
}

export function GlobalVisitorMap({
  countryStats,
  uniqueVisitors,
}: GlobalVisitorMapProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [selectedCode, setSelectedCode] = useState<string>(
    countryStats[0]?.countryCode || 'ET'
  );
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  // Lookup map of countryCode -> visitor stat
  const statByCode = useMemo(() => {
    const map = new Map<string, VisitorCountryStat>();
    for (const s of countryStats) {
      map.set(s.countryCode.toUpperCase(), s);
    }
    return map;
  }, [countryStats]);

  // Lookup map of countryCode -> high-precision Mercator location geometry
  const locationByCode = useMemo(() => {
    const map = new Map<string, WorldMapLocation>();
    for (const loc of WORLD_LOCATIONS) {
      map.set(loc.code, loc);
    }
    return map;
  }, []);

  const activeCode = hoveredCode || selectedCode || countryStats[0]?.countryCode || null;

  const activeCountry = useMemo(() => {
    if (activeCode && statByCode.has(activeCode)) {
      return statByCode.get(activeCode)!;
    }
    if (activeCode && hoveredCode && locationByCode.has(activeCode)) {
      const loc = locationByCode.get(activeCode)!;
      return {
        countryCode: loc.code,
        countryName: loc.name,
        region: 'International',
        visitors: 0,
        pageViews: 0,
        visitorShare: 0,
        trafficShare: 0,
        coordinates: { x: loc.cx, y: loc.cy },
      } satisfies VisitorCountryStat;
    }
    return countryStats[0] || null;
  }, [activeCode, hoveredCode, statByCode, locationByCode, countryStats]);

  const topCountry = countryStats[0] || null;
  const maxVisitors = Math.max(
    1,
    ...countryStats.map((c) => c.visitors)
  );

  // Determine choropleth fill color matching the 5-step blue palette in the reference image
  const getCountryFill = (code: string): string => {
    const stat = statByCode.get(code);
    const isSelected = activeCountry?.countryCode === code;
    const isHovered = hoveredCode === code;

    if (!stat || stat.visitors <= 0) {
      return isHovered ? '#BFDBFE' : '#C9DDF8';
    }
    if (isSelected || isHovered) {
      return '#1D4ED8';
    }

    const ratio = stat.visitors / maxVisitors;
    if (ratio >= 0.75) return '#2563EB';
    if (ratio >= 0.35) return '#3B82F6';
    if (ratio >= 0.15) return '#60A5FA';
    return '#93C5FD';
  };

  // Build Top Countries rows (up to 8 individual + "Other Countries" row if > 9)
  const topCountriesRows = useMemo(() => {
    if (countryStats.length <= 9) {
      return {
        primary: countryStats,
        other: null,
      };
    }
    const primary = countryStats.slice(0, 8);
    const rest = countryStats.slice(8);
    const otherVisitors = rest.reduce((sum, c) => sum + c.visitors, 0);
    const otherShare = Number(
      rest
        .reduce((sum, c) => sum + (c.visitorShare || c.trafficShare || 0), 0)
        .toFixed(1)
    );
    return {
      primary,
      other: {
        countryCode: 'OTHER',
        countryName: 'Other Countries',
        visitors: otherVisitors,
        share: otherShare,
      },
    };
  }, [countryStats]);

  // Compute safe tooltip anchor percentages inside the 1010x666 Mercator map container
  const tooltipPos = useMemo(() => {
    if (!activeCountry) return { leftPct: 24, topPct: 42 };
    const loc = locationByCode.get(activeCountry.countryCode.toUpperCase());
    const cx = loc?.cx ?? activeCountry.coordinates.x ?? 505;
    const cy = loc?.cy ?? activeCountry.coordinates.y ?? 333;
    const xPct = (cx / 1010) * 100;
    const yPct = (cy / 666) * 100;
    return {
      leftPct: Math.min(62, Math.max(8, xPct - 6)),
      topPct: Math.min(68, Math.max(12, yPct - 10)),
    };
  }, [activeCountry, locationByCode]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({
      x: Math.max(-180, Math.min(180, e.clientX - dragStart.x)),
      y: Math.max(-120, Math.min(120, e.clientY - dragStart.y)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Top Header Bar Matching Reference Screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1938] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-extrabold text-[#0B1938]">
              Global Visitor Map
            </h3>
            <p className="text-xs text-slate-400">
              Real visitor countries and traffic statistics
            </p>
          </div>
        </div>

        {/* Top Country & Total Visitors Summary */}
        <div className="flex items-center gap-5 sm:gap-7">
          <div className="flex items-center gap-2.5">
            <CountryFlag
              code={topCountry?.countryCode || 'ET'}
              className="w-6 h-4 rounded-[3px]"
            />
            <div>
              <span className="block text-[11px] font-medium text-slate-400 leading-tight">
                Top Country
              </span>
              <span className="font-heading text-xs sm:text-sm font-extrabold text-[#0B1938]">
                {topCountry ? topCountry.countryName : 'Ethiopia'}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-medium text-slate-400 leading-tight">
                Total Visitors
              </span>
              <span className="font-heading text-xs sm:text-sm font-extrabold text-[#0B1938]">
                {uniqueVisitors.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: High-Precision Mercator Choropleth Map (7 cols) + Top Countries Ranking (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 items-stretch flex-1">
        {/* Left: High-Precision Vector Choropleth World Map Matching Reference Silhouette */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            setHoveredCode(null);
          }}
          className={`lg:col-span-7 relative rounded-2xl bg-[#F8FAFC] border border-slate-100 min-h-[325px] flex flex-col justify-between overflow-hidden p-3 ${
            zoom > 1
              ? isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-default'
          }`}
        >
          {/* Zoom + / - Controls */}
          <div className="absolute top-3 left-3 z-20 flex flex-col bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setZoom((z) => Math.min(2.4, +(z + 0.3).toFixed(2)))
              }
              aria-label="Zoom in"
              className="p-1.5 text-slate-600 hover:bg-slate-50 border-b border-slate-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom((z) => {
                  const next = Math.max(1, +(z - 0.3).toFixed(2));
                  if (next === 1) setPan({ x: 0, y: 0 });
                  return next;
                });
              }}
              aria-label="Zoom out"
              className="p-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            {(zoom > 1 || pan.x !== 0 || pan.y !== 0) && (
              <button
                type="button"
                onClick={handleResetView}
                aria-label="Reset zoom"
                className="p-1.5 text-slate-500 hover:bg-slate-50 border-t border-slate-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* High-Precision 256-Country Mercator SVG World Map */}
          <div className="flex-1 flex items-center justify-center overflow-hidden my-auto">
            <svg
              viewBox="0 18 1010 638"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full max-h-[290px] transition-transform duration-200 select-none"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
              role="img"
              aria-label="Global Visitor Choropleth World Map"
            >
              <g
                stroke="#FFFFFF"
                strokeWidth="0.7"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                {WORLD_LOCATIONS.map((loc) => {
                  const stat = statByCode.get(loc.code);
                  const hasStats = Boolean(stat && stat.visitors > 0);
                  return (
                    <path
                      key={loc.code}
                      d={loc.path}
                      fill={getCountryFill(loc.code)}
                      className="cursor-pointer transition-colors duration-150"
                      onMouseEnter={() => setHoveredCode(loc.code)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCode(loc.code);
                      }}
                    >
                      <title>
                        {loc.name}
                        {hasStats && stat
                          ? `: ${stat.visitors.toLocaleString()} visitors (${(
                              stat.visitorShare ||
                              stat.trafficShare ||
                              0
                            ).toFixed(1)}%)`
                          : ': 0 visitors'}
                      </title>
                    </path>
                  );
                })}
              </g>

              {/* Interactive Country Pins for All Recorded Countries */}
              {countryStats.map((stat) => {
                const loc = locationByCode.get(stat.countryCode.toUpperCase());
                const cx = loc?.cx ?? stat.coordinates.x;
                const cy = loc?.cy ?? stat.coordinates.y;
                const isSelected =
                  activeCountry?.countryCode === stat.countryCode;
                return (
                  <g
                    key={`pin-${stat.countryCode}`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCode(stat.countryCode);
                    }}
                  >
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={13}
                        fill="#1D4ED8"
                        opacity={0.22}
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 5.2 : 3.5}
                      fill={isSelected ? '#1E40AF' : '#2563EB'}
                      stroke="#FFFFFF"
                      strokeWidth="1.6"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Floating Selected/Hovered Country Tooltip Card Matching Reference */}
          {activeCountry && (
            <div
              style={{
                left: `${tooltipPos.leftPct}%`,
                top: `${tooltipPos.topPct}%`,
              }}
              className="absolute z-20 bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200/90 shadow-lg px-3.5 py-2.5 space-y-1 min-w-[156px] transition-all duration-200 pointer-events-none"
            >
              <div className="flex items-center gap-2 font-heading text-xs font-extrabold text-[#0B1938]">
                <CountryFlag
                  code={activeCountry.countryCode}
                  className="w-4 h-3"
                />
                <span className="truncate max-w-[140px]">
                  {activeCountry.countryName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="w-2 h-2 rotate-45 bg-[#F59E0B] inline-block shrink-0" />
                <span>
                  Visitors:{' '}
                  <strong className="text-[#0B1938] font-bold">
                    {activeCountry.visitors.toLocaleString()}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="w-2 h-2 rotate-45 bg-emerald-500 inline-block shrink-0" />
                <span>
                  <strong className="text-[#0B1938] font-bold">
                    {(
                      activeCountry.visitorShare ||
                      activeCountry.trafficShare ||
                      0
                    ).toFixed(1)}
                    %
                  </strong>{' '}
                  of total
                </span>
              </div>
            </div>
          )}

          {/* Bottom Traffic Intensity Legend Bar */}
          <div className="relative z-10 pt-2 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1 w-60 max-w-full">
              <div className="grid grid-cols-5 h-2 rounded-full overflow-hidden border border-slate-200/60">
                <div className="bg-[#C9DDF8]" />
                <div className="bg-[#93C5FD]" />
                <div className="bg-[#60A5FA]" />
                <div className="bg-[#2563EB]" />
                <div className="bg-[#1D4ED8]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                <span>1</span>
                <span>10</span>
                <span>100</span>
                <span>1,000</span>
                <span>10,000+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Top Countries Table Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-100 bg-white p-4 flex flex-col justify-between shadow-2xs">
          <div>
            <h4 className="font-heading text-sm font-extrabold text-[#0B1938] mb-3">
              Top Countries
            </h4>

            <div className="grid grid-cols-12 text-[11px] font-semibold text-slate-400 pb-2 border-b border-slate-100 px-1.5">
              <div className="col-span-7">Country</div>
              <div className="col-span-3 text-right">Visitors</div>
              <div className="col-span-2 text-right">%</div>
            </div>

            {countryStats.length === 0 ? (
              <div className="py-12 text-center space-y-1.5">
                <p className="text-xs font-bold text-[#0B1938]">
                  No visitor countries recorded yet
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Countries appear automatically here as real visitors browse the website.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100/80">
                {topCountriesRows.primary.map((country, idx) => {
                  const isSelected =
                    activeCountry?.countryCode === country.countryCode;
                  const shareVal =
                    country.visitorShare || country.trafficShare || 0;
                  return (
                    <button
                      key={country.countryCode}
                      type="button"
                      onClick={() => setSelectedCode(country.countryCode)}
                      className={`w-full grid grid-cols-12 items-center py-2 px-1.5 text-xs transition-colors rounded-lg ${
                        isSelected
                          ? 'bg-blue-50/80 font-bold text-[#0B1938]'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="col-span-7 flex items-center gap-2 text-left truncate">
                        <span className="text-slate-400 w-4 text-[11px] font-medium">
                          {idx + 1}.
                        </span>
                        <CountryFlag
                          code={country.countryCode}
                          className="w-4 h-3"
                        />
                        <span className="truncate font-medium text-[#0B1938]">
                          {country.countryName}
                        </span>
                      </div>
                      <div className="col-span-3 text-right font-semibold text-[#0B1938] tabular-nums">
                        {country.visitors.toLocaleString()}
                      </div>
                      <div className="col-span-2 text-right text-slate-500 text-[11px] tabular-nums">
                        {shareVal.toFixed(1)}%
                      </div>
                    </button>
                  );
                })}

                {topCountriesRows.other && (
                  <div className="w-full grid grid-cols-12 items-center py-2 px-1.5 text-xs text-slate-600">
                    <div className="col-span-7 flex items-center gap-2 text-left truncate">
                      <span className="text-slate-400 w-4 text-[11px] font-medium">
                        10.
                      </span>
                      <CountryFlag code="OTHER" className="w-4 h-3" />
                      <span className="truncate font-medium text-[#0B1938]">
                        Other Countries
                      </span>
                    </div>
                    <div className="col-span-3 text-right font-semibold text-[#0B1938] tabular-nums">
                      {topCountriesRows.other.visitors.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-right text-slate-500 text-[11px] tabular-nums">
                      {topCountriesRows.other.share.toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
