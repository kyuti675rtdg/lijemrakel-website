'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ExecutiveMember, ProductItem } from '@/types';
import {
  OrbitConfigRecord,
  ProductCategoryRecord,
  SiteImagesConfig,
} from '@/types/admin';
import { MANAGEMENT_TEAM } from '@/data/leadershipData';
import { NEWS_ARTICLES, NewsArticle } from '@/data/newsData';
import { CATALOGUE_PRODUCTS } from '@/data/catalogueProducts';
import { INITIAL_PRODUCT_CATEGORIES } from '@/data/adminInitialData';
import { OrbitKnowledgeEntry } from '@/lib/orbitAssistantEngine';
import orbitKnowledgeBaseRaw from '@/data/orbitKnowledgeBase.json';

export const INITIAL_SITE_IMAGES: SiteImagesConfig = {
  homeHeroImage: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
  homeAboutMainImage: '/images/hero/lijemrakel-about-final.jpg',
  homeAboutAccentImage: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
  aboutOfficeImage: '/images/hero/lijemrakel-about-final.jpg',
  strategyPhase1Image: '/images/strategy/phase-1.jpg',
  strategyPhase2Image: '/images/strategy/phase-2.jpg',
  strategyPhase3Image: '/images/strategy/phase-3.jpg',
  strategyPhase4Image: '/images/strategy/phase-4.jpg',
};

export const INITIAL_ORBIT_CONFIG: OrbitConfigRecord = {
  assistantName: orbitKnowledgeBaseRaw.assistantMeta.name,
  welcomeMessage: orbitKnowledgeBaseRaw.assistantMeta.welcomeMessage,
  whatsappNumber: '0913514767',
  whatsappPrefilledMessage:
    "Hello, I'm contacting Lijemrakel Trading PLC. I'd like to know more about your products and services.",
  defaultSuggestions: orbitKnowledgeBaseRaw.assistantMeta.defaultSuggestions,
};

export const INITIAL_ORBIT_FAQS: OrbitKnowledgeEntry[] =
  orbitKnowledgeBaseRaw.entries as OrbitKnowledgeEntry[];

export interface PublicCmsSnapshot {
  team: ExecutiveMember[];
  news: NewsArticle[];
  products: ProductItem[];
  categories: ProductCategoryRecord[];
  siteImages: SiteImagesConfig;
  orbitConfig?: OrbitConfigRecord;
  orbitFaqs?: OrbitKnowledgeEntry[];
}

export interface PublicCmsPayload {
  team: ExecutiveMember[];
  news: NewsArticle[];
  products: ProductItem[];
  categories: ProductCategoryRecord[];
  siteImages: SiteImagesConfig;
  orbitConfig: OrbitConfigRecord;
  orbitFaqs: OrbitKnowledgeEntry[];
  loaded: boolean;
  refreshCms: () => Promise<void>;
}

const CMS_SYNC_CHANNEL = 'lijemrakel-cms-sync';
const CMS_UPDATED_EVENT = 'lijemrakel:cms-updated';

let clientCmsCache: Omit<PublicCmsPayload, 'refreshCms'> | null = null;

function preloadImageUrls(urls: string[]): Promise<void> {
  if (typeof window === 'undefined' || urls.length === 0) {
    return Promise.resolve();
  }
  const uniqueUrls = Array.from(
    new Set(urls.filter((u) => typeof u === 'string' && u.trim().length > 0))
  );
  if (uniqueUrls.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let remaining = uniqueUrls.length;
    const timeout = window.setTimeout(() => resolve(), 1200);
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearTimeout(timeout);
        resolve();
      }
    };
    uniqueUrls.forEach((src) => {
      const img = new window.Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
  });
}

export function notifyCmsUpdated(): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(CMS_UPDATED_EVENT));
  } catch {
    // ignore
  }
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel(CMS_SYNC_CHANNEL);
      bc.postMessage({ type: 'CMS_UPDATED', timestamp: Date.now() });
      bc.close();
    }
  } catch {
    // ignore
  }
}

function buildInitialPayload(
  initialData?: PublicCmsSnapshot
): Omit<PublicCmsPayload, 'refreshCms'> {
  if (initialData) {
    const hydrated: Omit<PublicCmsPayload, 'refreshCms'> = {
      team:
        Array.isArray(initialData.team) && initialData.team.length > 0
          ? initialData.team
          : MANAGEMENT_TEAM,
      news:
        Array.isArray(initialData.news) && initialData.news.length > 0
          ? initialData.news
          : NEWS_ARTICLES,
      products:
        Array.isArray(initialData.products) && initialData.products.length > 0
          ? initialData.products
          : CATALOGUE_PRODUCTS,
      categories:
        Array.isArray(initialData.categories) &&
        initialData.categories.length > 0
          ? initialData.categories
          : INITIAL_PRODUCT_CATEGORIES,
      siteImages: {
        ...INITIAL_SITE_IMAGES,
        ...(initialData.siteImages || {}),
      },
      orbitConfig: initialData.orbitConfig || INITIAL_ORBIT_CONFIG,
      orbitFaqs:
        Array.isArray(initialData.orbitFaqs) && initialData.orbitFaqs.length > 0
          ? initialData.orbitFaqs
          : INITIAL_ORBIT_FAQS,
      loaded: true,
    };
    clientCmsCache = hydrated;
    return hydrated;
  }

  if (clientCmsCache) {
    return clientCmsCache;
  }

  return {
    team: MANAGEMENT_TEAM,
    news: NEWS_ARTICLES,
    products: CATALOGUE_PRODUCTS,
    categories: INITIAL_PRODUCT_CATEGORIES,
    siteImages: INITIAL_SITE_IMAGES,
    orbitConfig: INITIAL_ORBIT_CONFIG,
    orbitFaqs: INITIAL_ORBIT_FAQS,
    loaded: false,
  };
}

const PublicCmsContext = createContext<PublicCmsPayload | null>(null);

export function PublicCmsProvider({
  initialData,
  children,
}: {
  initialData?: PublicCmsSnapshot;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<Omit<PublicCmsPayload, 'refreshCms'>>(() =>
    buildInitialPayload(initialData)
  );

  // Sync if server prop updates during route refresh
  useEffect(() => {
    if (initialData) {
      const next = buildInitialPayload(initialData);
      clientCmsCache = next;
      setState(next);
    }
  }, [initialData]);

  const fetchCms = useCallback(async () => {
    try {
      const res = await fetch('/api/public/cms', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();

      const nextTeam: ExecutiveMember[] =
        Array.isArray(data.team) && data.team.length > 0
          ? data.team
          : MANAGEMENT_TEAM;
      const nextNews: NewsArticle[] =
        Array.isArray(data.news) && data.news.length > 0
          ? data.news
          : NEWS_ARTICLES;
      const nextProducts: ProductItem[] =
        Array.isArray(data.products) && data.products.length > 0
          ? data.products
          : CATALOGUE_PRODUCTS;
      const nextCategories: ProductCategoryRecord[] =
        Array.isArray(data.categories) && data.categories.length > 0
          ? data.categories
          : INITIAL_PRODUCT_CATEGORIES;
      const nextSiteImages: SiteImagesConfig = {
        ...INITIAL_SITE_IMAGES,
        ...(data.siteImages || {}),
      };
      const nextOrbitConfig: OrbitConfigRecord =
        data.orbitConfig || INITIAL_ORBIT_CONFIG;
      const nextOrbitFaqs: OrbitKnowledgeEntry[] =
        Array.isArray(data.orbitFaqs) && data.orbitFaqs.length > 0
          ? data.orbitFaqs
          : INITIAL_ORBIT_FAQS;

      // Preload any newly changed portrait or hero images before committing state
      // so the browser never flashes a blank or partial image during live updates.
      const urlsToPreload: string[] = [
        ...nextTeam.map((m) => m.portraitUrl),
        ...Object.values(nextSiteImages),
      ];
      await preloadImageUrls(urlsToPreload);

      const nextPayload: Omit<PublicCmsPayload, 'refreshCms'> = {
        team: nextTeam,
        news: nextNews,
        products: nextProducts,
        categories: nextCategories,
        siteImages: nextSiteImages,
        orbitConfig: nextOrbitConfig,
        orbitFaqs: nextOrbitFaqs,
        loaded: true,
      };
      clientCmsCache = nextPayload;
      setState(nextPayload);
    } catch {
      // Keep existing state gracefully
    }
  }, []);

  useEffect(() => {
    fetchCms();

    const onFocus = () => fetchCms();
    const onCustomUpdate = () => fetchCms();
    window.addEventListener('focus', onFocus);
    window.addEventListener(CMS_UPDATED_EVENT, onCustomUpdate);

    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel(CMS_SYNC_CHANNEL);
        bc.onmessage = () => {
          fetchCms();
        };
      }
    } catch {
      // ignore
    }

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener(CMS_UPDATED_EVENT, onCustomUpdate);
      if (bc) {
        bc.close();
      }
    };
  }, [fetchCms]);

  const value: PublicCmsPayload = {
    ...state,
    refreshCms: fetchCms,
  };

  return React.createElement(PublicCmsContext.Provider, { value }, children);
}

export function usePublicCms(): PublicCmsPayload {
  const ctx = useContext(PublicCmsContext);
  const [fallbackState, setFallbackState] = useState<
    Omit<PublicCmsPayload, 'refreshCms'>
  >(() => buildInitialPayload());

  const fetchFallback = useCallback(async () => {
    if (ctx) return;
    try {
      const res = await fetch('/api/public/cms', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const nextPayload: Omit<PublicCmsPayload, 'refreshCms'> = {
        team:
          Array.isArray(data.team) && data.team.length > 0
            ? data.team
            : MANAGEMENT_TEAM,
        news:
          Array.isArray(data.news) && data.news.length > 0
            ? data.news
            : NEWS_ARTICLES,
        products:
          Array.isArray(data.products) && data.products.length > 0
            ? data.products
            : CATALOGUE_PRODUCTS,
        categories:
          Array.isArray(data.categories) && data.categories.length > 0
            ? data.categories
            : INITIAL_PRODUCT_CATEGORIES,
        siteImages: {
          ...INITIAL_SITE_IMAGES,
          ...(data.siteImages || {}),
        },
        orbitConfig: data.orbitConfig || INITIAL_ORBIT_CONFIG,
        orbitFaqs:
          Array.isArray(data.orbitFaqs) && data.orbitFaqs.length > 0
            ? data.orbitFaqs
            : INITIAL_ORBIT_FAQS,
        loaded: true,
      };
      clientCmsCache = nextPayload;
      setFallbackState(nextPayload);
    } catch {
      // ignore
    }
  }, [ctx]);

  useEffect(() => {
    if (!ctx) {
      fetchFallback();
    }
  }, [ctx, fetchFallback]);

  if (ctx) {
    return ctx;
  }

  return {
    ...fallbackState,
    refreshCms: fetchFallback,
  };
}
