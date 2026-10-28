'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExecutiveMember, ProductItem } from '@/types';
import { ProductCategoryRecord, SiteImagesConfig } from '@/types/admin';
import { MANAGEMENT_TEAM } from '@/data/leadershipData';
import { NEWS_ARTICLES, NewsArticle } from '@/data/newsData';
import { CATALOGUE_PRODUCTS } from '@/data/catalogueProducts';
import { INITIAL_PRODUCT_CATEGORIES } from '@/data/adminInitialData';

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

export interface PublicCmsPayload {
  team: ExecutiveMember[];
  news: NewsArticle[];
  products: ProductItem[];
  categories: ProductCategoryRecord[];
  siteImages: SiteImagesConfig;
  loaded: boolean;
}

export function usePublicCms(): PublicCmsPayload {
  const [team, setTeam] = useState<ExecutiveMember[]>(MANAGEMENT_TEAM);
  const [news, setNews] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [products, setProducts] = useState<ProductItem[]>(CATALOGUE_PRODUCTS);
  const [categories, setCategories] = useState<ProductCategoryRecord[]>(
    INITIAL_PRODUCT_CATEGORIES
  );
  const [siteImages, setSiteImages] =
    useState<SiteImagesConfig>(INITIAL_SITE_IMAGES);
  const [loaded, setLoaded] = useState(false);

  const fetchCms = useCallback(async () => {
    try {
      const res = await fetch('/api/public/cms', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.team) && data.team.length > 0) {
        setTeam(data.team);
      }
      if (Array.isArray(data.news) && data.news.length > 0) {
        setNews(data.news);
      }
      if (Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      }
      if (Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
      }
      if (data.siteImages) {
        setSiteImages({
          ...INITIAL_SITE_IMAGES,
          ...data.siteImages,
        });
      }
      setLoaded(true);
    } catch {
      // Fallback to static defaults gracefully
    }
  }, []);

  useEffect(() => {
    fetchCms();
    const onFocus = () => fetchCms();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchCms]);

  return {
    team,
    news,
    products,
    categories,
    siteImages,
    loaded,
  };
}
