'use client';

import React, { useMemo, useState } from 'react';
import { Globe, Users, Plus, Minus, RotateCcw } from 'lucide-react';
import { VisitorCountryStat } from '@/types/admin';

export type AnalyticsDaysRange = 7 | 30 | 90 | 365;

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

interface WorldCountryShape {
  code: string;
  name: string;
  d: string;
}

/**
 * Detailed, accurate geographic world map country & territory polygons (1000 x 500 viewBox)
 * Styled after professional SaaS choropleth analytics maps.
 */
const WORLD_COUNTRY_SHAPES: WorldCountryShape[] = [
  // NORTH AMERICA
  {
    code: 'CA',
    name: 'Canada',
    d: 'M122,72 L145,60 L178,56 L212,62 L248,54 L278,66 L305,82 L318,104 L302,126 L284,138 L260,144 L236,140 L198,140 L152,138 L134,122 L118,98 Z M72,74 L116,68 L120,98 L98,104 L68,94 Z M234,36 L278,32 L294,48 L266,54 L236,48 Z M178,38 L218,34 L224,48 L184,50 Z',
  },
  {
    code: 'US',
    name: 'United States',
    d: 'M136,138 L198,140 L238,140 L264,144 L286,138 L296,150 L282,168 L272,186 L262,206 L252,204 L244,192 L222,196 L210,210 L196,198 L176,194 L154,188 L138,172 L132,154 Z',
  },
  {
    code: 'MX',
    name: 'Mexico & Central America',
    d: 'M158,190 L178,194 L196,200 L208,212 L222,218 L234,234 L244,250 L232,254 L214,240 L194,228 L174,214 Z M242,222 L266,220 L274,228 L248,228 Z',
  },
  {
    code: 'GL',
    name: 'Greenland',
    d: 'M322,26 L368,20 L414,28 L422,52 L398,78 L368,90 L344,82 L326,56 Z',
  },

  // SOUTH AMERICA
  {
    code: 'CO',
    name: 'Northern South America',
    d: 'M246,252 L272,248 L298,256 L312,268 L292,286 L264,296 L246,282 Z',
  },
  {
    code: 'PE',
    name: 'Peru & Bolivia',
    d: 'M246,282 L268,294 L290,312 L292,344 L274,352 L254,324 L242,298 Z',
  },
  {
    code: 'BR',
    name: 'Brazil',
    d: 'M294,268 L322,272 L352,286 L372,306 L366,336 L348,364 L326,382 L308,372 L292,344 L290,312 L268,294 Z',
  },
  {
    code: 'AR',
    name: 'Argentina & Chile',
    d: 'M274,352 L292,344 L310,372 L324,384 L314,414 L302,446 L292,464 L278,454 L274,418 L272,382 Z',
  },

  // EUROPE
  {
    code: 'IS',
    name: 'Iceland',
    d: 'M434,82 L456,78 L460,90 L438,92 Z',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    d: 'M468,112 L484,108 L492,126 L488,140 L470,138 L464,126 Z M456,120 L466,118 L466,132 L456,132 Z',
  },
  {
    code: 'NO',
    name: 'Norway',
    d: 'M502,98 L516,74 L538,56 L552,60 L534,86 L520,108 L504,108 Z',
  },
  {
    code: 'SE',
    name: 'Sweden & Finland',
    d: 'M520,108 L534,84 L552,60 L574,66 L580,96 L562,110 L544,120 L526,118 Z',
  },
  {
    code: 'FR',
    name: 'France',
    d: 'M478,144 L502,140 L514,150 L512,168 L494,172 L478,164 Z',
  },
  {
    code: 'ES',
    name: 'Spain & Portugal',
    d: 'M462,164 L492,168 L496,184 L476,190 L460,184 Z',
  },
  {
    code: 'NL',
    name: 'Netherlands',
    d: 'M502,128 L514,126 L514,138 L502,140 Z',
  },
  {
    code: 'BE',
    name: 'Belgium',
    d: 'M498,138 L512,138 L512,146 L498,146 Z',
  },
  {
    code: 'DE',
    name: 'Germany',
    d: 'M512,126 L534,126 L538,142 L532,154 L512,152 Z',
  },
  {
    code: 'CH',
    name: 'Switzerland & Austria',
    d: 'M512,152 L540,152 L542,160 L512,160 Z',
  },
  {
    code: 'IT',
    name: 'Italy',
    d: 'M514,160 L534,160 L548,178 L542,190 L532,184 L520,170 Z',
  },
  {
    code: 'PL',
    name: 'Central & Eastern Europe',
    d: 'M534,124 L564,122 L572,142 L568,162 L552,176 L538,166 L534,148 Z',
  },
  {
    code: 'UA',
    name: 'Ukraine & Belarus',
    d: 'M564,118 L598,118 L608,138 L596,156 L568,154 Z',
  },

  // EURASIA & MIDDLE EAST
  {
    code: 'RU',
    name: 'Russia',
    d: 'M576,66 L628,56 L702,48 L788,52 L872,62 L928,78 L916,108 L874,124 L842,146 L798,148 L748,138 L698,136 L646,136 L608,136 L596,116 L578,96 Z',
  },
  {
    code: 'KZ',
    name: 'Central Asia',
    d: 'M616,136 L698,136 L724,156 L696,178 L636,176 L614,158 Z',
  },
  {
    code: 'TR',
    name: 'Turkey',
    d: 'M562,172 L608,170 L614,186 L566,188 Z',
  },
  {
    code: 'IR',
    name: 'Iran & Iraq',
    d: 'M608,184 L646,180 L668,198 L660,220 L626,216 L606,198 Z',
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    d: 'M596,204 L626,204 L650,224 L656,244 L628,258 L608,248 L596,222 Z',
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    d: 'M644,222 L662,222 L664,236 L646,238 Z',
  },

  // AFRICA
  {
    code: 'MA',
    name: 'Morocco',
    d: 'M454,194 L486,192 L488,214 L452,224 Z',
  },
  {
    code: 'DZ',
    name: 'Algeria & Tunisia',
    d: 'M486,190 L526,188 L532,216 L508,242 L478,236 L484,212 Z',
  },
  {
    code: 'LY',
    name: 'Libya',
    d: 'M526,196 L564,198 L564,238 L528,238 Z',
  },
  {
    code: 'EG',
    name: 'Egypt',
    d: 'M564,200 L594,202 L598,236 L564,236 Z',
  },
  {
    code: 'NG',
    name: 'Nigeria & West Africa',
    d: 'M452,224 L482,236 L528,238 L544,264 L536,288 L508,290 L476,286 L450,266 Z',
  },
  {
    code: 'SD',
    name: 'Sudan & Chad',
    d: 'M544,238 L598,236 L606,258 L592,286 L556,286 L542,262 Z',
  },
  {
    code: 'DJ',
    name: 'Djibouti & Horn Coast',
    d: 'M610,258 L636,262 L638,284 L620,298 L614,284 Z',
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    d: 'M590,258 L614,256 L628,270 L620,288 L594,290 L586,274 Z',
  },
  {
    code: 'KE',
    name: 'Kenya',
    d: 'M592,290 L618,288 L620,314 L596,316 L588,302 Z',
  },
  {
    code: 'CD',
    name: 'Central Africa & DRC',
    d: 'M522,288 L562,286 L588,290 L588,324 L568,346 L532,342 L520,312 Z',
  },
  {
    code: 'TZ',
    name: 'Tanzania & East Africa',
    d: 'M586,314 L616,314 L616,348 L586,352 L578,332 Z',
  },
  {
    code: 'AO',
    name: 'Southern Central Africa',
    d: 'M528,342 L574,344 L608,350 L602,382 L568,386 L528,378 Z',
  },
  {
    code: 'ZA',
    name: 'South Africa',
    d: 'M532,378 L588,382 L594,404 L572,424 L544,422 L532,398 Z',
  },
  {
    code: 'MG',
    name: 'Madagascar',
    d: 'M624,354 L638,348 L642,386 L626,392 Z',
  },

  // ASIA & OCEANIA
  {
    code: 'PK',
    name: 'Pakistan & Afghanistan',
    d: 'M666,184 L698,182 L706,208 L684,228 L662,216 Z',
  },
  {
    code: 'IN',
    name: 'India',
    d: 'M692,202 L728,200 L752,218 L742,244 L722,282 L708,282 L696,248 L684,226 Z M724,284 L732,284 L732,294 L724,294 Z',
  },
  {
    code: 'CN',
    name: 'China & Mongolia',
    d: 'M704,138 L758,136 L812,144 L848,144 L858,168 L846,198 L824,224 L792,232 L762,226 L744,212 L718,196 L702,174 Z',
  },
  {
    code: 'TH',
    name: 'Southeast Asia',
    d: 'M756,224 L796,228 L812,252 L796,278 L782,292 L770,272 L756,248 Z',
  },
  {
    code: 'SG',
    name: 'Singapore',
    d: 'M778,290 L790,290 L790,298 L778,298 Z',
  },
  {
    code: 'ID',
    name: 'Indonesia & Maritime SEA',
    d: 'M760,296 L792,312 L818,320 L786,324 L756,308 Z M802,294 L828,292 L830,312 L804,312 Z M836,302 L878,306 L884,322 L840,320 Z',
  },
  {
    code: 'PH',
    name: 'Philippines',
    d: 'M832,248 L846,246 L852,276 L836,278 Z',
  },
  {
    code: 'KR',
    name: 'Korea',
    d: 'M842,172 L856,172 L858,192 L844,192 Z',
  },
  {
    code: 'JP',
    name: 'Japan',
    d: 'M874,154 L890,156 L892,176 L876,196 L864,192 L872,172 Z',
  },
  {
    code: 'AU',
    name: 'Australia',
    d: 'M784,344 L828,334 L868,342 L894,368 L888,402 L856,422 L816,412 L782,396 L774,368 Z M858,426 L870,426 L868,436 L858,434 Z',
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    d: 'M918,412 L934,402 L942,428 L924,442 Z',
  },
];

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
  const [selectedCode, setSelectedCode] = useState<string>(
    countryStats[0]?.countryCode || 'US'
  );

  // Build lookup map of countryCode -> stat
  const statByCode = useMemo(() => {
    const map = new Map<string, VisitorCountryStat>();
    for (const s of countryStats) {
      map.set(s.countryCode.toUpperCase(), s);
    }
    return map;
  }, [countryStats]);

  const activeCountry =
    statByCode.get(selectedCode) || countryStats[0] || null;

  const topCountry = countryStats[0] || null;
  const maxVisitors = Math.max(
    1,
    ...countryStats.map((c) => c.visitors)
  );

  // Determine choropleth fill color matching the 5-step blue palette in the reference image
  const getCountryFill = (code: string): string => {
    const stat = statByCode.get(code);
    const isSelected = activeCountry?.countryCode === code;

    if (!stat || stat.visitors <= 0) {
      return '#DCE8F7';
    }
    if (isSelected) {
      return '#1D4ED8';
    }

    const ratio = stat.visitors / maxVisitors;
    if (ratio >= 0.75) return '#2563EB';
    if (ratio >= 0.35) return '#3B82F6';
    if (ratio >= 0.15) return '#60A5FA';
    return '#93C5FD';
  };

  // Build Top Countries rows (up to 8 individual + "Other Countries" row if > 8)
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
      rest.reduce((sum, c) => sum + (c.visitorShare || c.trafficShare || 0), 0).toFixed(1)
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

  // Compute safe tooltip anchor percentages inside the map container
  const tooltipPos = useMemo(() => {
    if (!activeCountry) return { leftPct: 24, topPct: 42 };
    const xPct = (activeCountry.coordinates.x / 1000) * 100;
    const yPct = (activeCountry.coordinates.y / 480) * 100;
    return {
      leftPct: Math.min(64, Math.max(10, xPct - 6)),
      topPct: Math.min(68, Math.max(16, yPct - 8)),
    };
  }, [activeCountry]);

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

      {/* Main Split: Choropleth Map (7 cols) + Top Countries Ranking (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 items-stretch flex-1">
        {/* Left: Light Choropleth World Map */}
        <div className="lg:col-span-7 relative rounded-2xl bg-[#F8FAFC] border border-slate-100 min-h-[310px] flex flex-col justify-between overflow-hidden p-3">
          {/* Zoom + / - Controls */}
          <div className="absolute top-3 left-3 z-20 flex flex-col bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setZoom((z) => Math.min(1.6, +(z + 0.2).toFixed(2)))
              }
              aria-label="Zoom in"
              className="p-1.5 text-slate-600 hover:bg-slate-50 border-b border-slate-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))
              }
              aria-label="Zoom out"
              className="p-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            {zoom > 1 && (
              <button
                type="button"
                onClick={() => setZoom(1)}
                aria-label="Reset zoom"
                className="p-1.5 text-slate-500 hover:bg-slate-50 border-t border-slate-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* SVG Choropleth Map */}
          <div className="flex-1 flex items-center justify-center overflow-hidden my-auto py-1">
            <svg
              viewBox="60 15 900 455"
              className="w-full h-full max-h-[265px] transition-transform duration-300 select-none"
              style={{ transform: `scale(${zoom})` }}
              role="img"
              aria-label="Global Visitor Choropleth Map"
            >
              <g stroke="#FFFFFF" strokeWidth="1.2" strokeLinejoin="round">
                {WORLD_COUNTRY_SHAPES.map((shape) => {
                  const hasStats = statByCode.has(shape.code);
                  return (
                    <path
                      key={shape.code}
                      d={shape.d}
                      fill={getCountryFill(shape.code)}
                      className={
                        hasStats
                          ? 'cursor-pointer transition-colors duration-200 hover:opacity-90'
                          : 'transition-colors duration-200'
                      }
                      onClick={() => {
                        if (hasStats) setSelectedCode(shape.code);
                      }}
                    >
                      <title>
                        {shape.name}
                        {hasStats
                          ? `: ${statByCode.get(shape.code)?.visitors.toLocaleString()} visitors (${
                              statByCode.get(shape.code)?.visitorShare ??
                              statByCode.get(shape.code)?.trafficShare
                            }%)`
                          : ''}
                      </title>
                    </path>
                  );
                })}
              </g>

              {/* Interactive Country Pins for All Recorded Countries */}
              {countryStats.map((stat) => {
                const isSelected =
                  activeCountry?.countryCode === stat.countryCode;
                return (
                  <g
                    key={`pin-${stat.countryCode}`}
                    className="cursor-pointer"
                    onClick={() => setSelectedCode(stat.countryCode)}
                  >
                    {isSelected && (
                      <circle
                        cx={stat.coordinates.x}
                        cy={stat.coordinates.y}
                        r={12}
                        fill="#1D4ED8"
                        opacity={0.22}
                      />
                    )}
                    <circle
                      cx={stat.coordinates.x}
                      cy={stat.coordinates.y}
                      r={isSelected ? 5 : 3.2}
                      fill={isSelected ? '#1E40AF' : '#2563EB'}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Floating Selected Country Tooltip Card Matching Reference */}
          {activeCountry && (
            <div
              style={{
                left: `${tooltipPos.leftPct}%`,
                top: `${tooltipPos.topPct}%`,
              }}
              className="absolute z-20 bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200/90 shadow-lg px-3.5 py-2.5 space-y-1 min-w-[152px] transition-all duration-300 pointer-events-none"
            >
              <div className="flex items-center gap-2 font-heading text-xs font-extrabold text-[#0B1938]">
                <CountryFlag
                  code={activeCountry.countryCode}
                  className="w-4 h-3"
                />
                <span>{activeCountry.countryName}</span>
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
                <div className="bg-[#DCE8F7]" />
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
