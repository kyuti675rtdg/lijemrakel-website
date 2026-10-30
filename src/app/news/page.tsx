'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, ChevronsRight, Sparkles } from 'lucide-react';
import {
  NEWS_CATEGORIES,
  NewsCategorySlug,
} from '@/data/newsData';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { SplitPillButton } from '@/components/ui/SplitPillButton';
import { usePublicCms } from '@/lib/usePublicCms';

function NewsContent() {
  const { news: articles } = usePublicCms();
  const searchParams = useSearchParams();
  const initialCategory =
    (searchParams.get('category') as NewsCategorySlug | 'all') || 'all';
  const [activeCategory, setActiveCategory] = useState<
    NewsCategorySlug | 'all'
  >(
    ['company-news', 'announcements', 'business-updates'].includes(
      initialCategory
    )
      ? initialCategory
      : 'all'
  );

  const filteredArticles =
    activeCategory === 'all'
      ? articles
      : articles.filter((a) => a.categorySlug === activeCategory);

  return (
    <section className="py-16 lg:py-24 bg-[#F7F7F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-[20px] shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            {NEWS_CATEGORIES.map((cat) => {
              const active = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href);
                      if (cat.slug === 'all') {
                        url.searchParams.delete('category');
                      } else {
                        url.searchParams.set('category', cat.slug);
                      }
                      window.history.replaceState({}, '', url.toString());
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-heading font-bold transition-colors ${
                    active
                      ? 'bg-[#0B0E29] text-white'
                      : 'bg-[#F7F7F3] text-brand-navy hover:bg-brand-orange'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="text-xs font-semibold text-brand-muted px-2">
            Showing {filteredArticles.length} updates
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-[24px] p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
            >
              <div>
                <div className="relative h-52 w-full rounded-[18px] overflow-hidden bg-[#0B0E29]">
                  <Image
                    key={article.image}
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-orange text-brand-navy">
                      {article.categoryLabel}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-brand-muted">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                      {article.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-orange" />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="font-heading text-lg font-bold text-brand-navy group-hover:text-brand-goldDark transition-colors leading-snug">
                    <Link href={`/news/${article.slug}`}>{article.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-brand-body line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-2">
                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F7F7F3] group-hover:bg-brand-orange text-brand-navy text-xs font-heading font-bold transition-colors"
                >
                  <span>Read Update</span>
                  <ChevronsRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom B2B Callout */}
        <div className="rounded-[28px] bg-[#0B0E29] text-white p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stay Connected</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">
              Looking for product availability or partnership details?
            </h3>
            <p className="text-sm text-white/75">
              Contact our veterinary technical and international trade team directly.
            </p>
          </div>
          <SplitPillButton
            href="/contact"
            label="Contact Our Team"
            variant="dark"
          />
        </div>
      </div>
    </section>
  );
}

export default function NewsPage() {
  return (
    <div>
      <PageHeroBanner
        eyebrow="News & Updates"
        title="Company News, Announcements & Business Updates"
        description="Follow the latest corporate developments, international sourcing milestones, and strategic agricultural updates from Lijemrakel Trading PLC."
        breadcrumbs={[{ label: 'News' }]}
      />
      <Suspense fallback={<div className="py-20 text-center">Loading updates...</div>}>
        <NewsContent />
      </Suspense>
    </div>
  );
}
