import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronsRight,
  CheckCircle2,
  Quote,
  Sparkles,
  Tag,
} from 'lucide-react';
import { NEWS_ARTICLES } from '@/data/newsData';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { SplitPillButton } from '@/components/ui/SplitPillButton';
import { readDb, mapAdminNewsToPublicArticles } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

interface NewsDetailProps {
  params: { slug: string };
}

export function generateMetadata({ params }: NewsDetailProps): Metadata {
  const db = readDb();
  const articles = mapAdminNewsToPublicArticles(db.news, db.team);
  const article =
    articles.find((a) => a.slug === params.slug) ||
    NEWS_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return { title: 'Update Not Found' };
  return {
    title: `${article.title} — Lijemrakel News`,
    description: article.excerpt,
  };
}

export default function NewsArticlePage({ params }: NewsDetailProps) {
  const db = readDb();
  const allArticles = mapAdminNewsToPublicArticles(db.news, db.team);
  const articles = allArticles.length > 0 ? allArticles : NEWS_ARTICLES;

  const articleIndex = articles.findIndex((a) => a.slug === params.slug);
  if (articleIndex === -1) notFound();

  const article = articles[articleIndex];
  const related = articles.filter((a) => a.id !== article.id).slice(0, 3);
  const nextArticle = articles[(articleIndex + 1) % articles.length];

  return (
    <div className="bg-white">
      <PageHeroBanner
        eyebrow={article.categoryLabel}
        title={article.title}
        description={article.excerpt}
        breadcrumbs={[
          { label: 'News', href: '/news' },
          { label: article.categoryLabel },
        ]}
      />

      <section className="py-16 lg:py-24 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* ===============================================================
                MAIN EDITORIAL READING COLUMN (8 COLS)
            =============================================================== */}
            <article className="lg:col-span-8 bg-white rounded-[24px] p-6 sm:p-10 lg:p-12 shadow-2xs space-y-8">
              {/* Top Meta & Author Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-brand-border">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-brand-orange shrink-0">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      fill
                      sizes="44px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="font-heading text-sm font-bold text-brand-navy">
                      {article.author.name}
                    </div>
                    <div className="text-xs text-brand-muted">
                      {article.author.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-brand-muted">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F7F3] text-brand-navy">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                    {article.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F7F3] text-brand-navy">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    {article.readTime}
                  </span>
                </div>
              </div>

              {/* Featured Article Image */}
              <div className="relative h-72 sm:h-96 w-full rounded-[20px] overflow-hidden bg-[#0B0E29]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover object-[center_20%]"
                  priority
                />
              </div>

              {/* Key Highlights Box */}
              <div className="rounded-[20px] bg-[#F7F7F3] p-6 sm:p-7 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-brand-navy">
                  <Sparkles className="w-4 h-4 text-brand-orange" />
                  <span>Key Highlights</span>
                </div>
                <ul className="space-y-2.5">
                  {article.keyTakeaways.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-brand-navy"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Structured Editorial Body Sections */}
              <div className="space-y-8">
                {article.sections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-brand-navy">
                      {section.heading}
                    </h2>
                    {section.paragraphs.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-sm sm:text-base text-brand-body leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Executive Pull-Quote */}
              <blockquote className="rounded-[20px] bg-[#0B0E29] text-white p-7 sm:p-8 border-l-4 border-brand-orange space-y-3">
                <Quote className="w-7 h-7 text-brand-orange" />
                <p className="font-heading text-base sm:text-lg font-semibold text-white leading-relaxed">
                  “{article.quote.text}”
                </p>
                <footer className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                  — {article.quote.attribution}
                </footer>
              </blockquote>

              {/* Tags & Back Link Footer */}
              <div className="pt-6 border-t border-brand-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-orange mr-1" />
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[#F7F7F3] text-xs font-heading font-semibold text-brand-navy"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href="/news"
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-brand-navy hover:text-brand-orange"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to All News</span>
                </Link>
              </div>

              {/* Next Article Card */}
              {nextArticle && (
                <div className="rounded-[20px] bg-[#F7F7F3] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                      Next Update
                    </span>
                    <h3 className="font-heading text-base font-bold text-brand-navy mt-1">
                      {nextArticle.title}
                    </h3>
                  </div>
                  <Link
                    href={`/news/${nextArticle.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-brand-navy text-xs font-heading font-bold hover:bg-brand-orange shrink-0 transition-colors"
                  >
                    <span>Read Next</span>
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </article>

            {/* ===============================================================
                STICKY SIDEBAR (4 COLS)
            =============================================================== */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              {/* Related Updates Box */}
              <div className="bg-white rounded-[24px] p-6 sm:p-7 shadow-2xs space-y-5">
                <h3 className="font-heading text-lg font-extrabold text-brand-navy">
                  More Updates
                </h3>
                <div className="divide-y divide-brand-border">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/news/${rel.slug}`}
                      className="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5 group"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#0B0E29] shrink-0">
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-goldDark">
                          {rel.categoryLabel}
                        </span>
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-brand-navy group-hover:text-brand-orange transition-colors line-clamp-2 mt-0.5 leading-snug">
                          {rel.title}
                        </h4>
                        <span className="text-[11px] text-brand-muted mt-1 block">
                          {rel.date}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Direct Inquiry Callout Card */}
              <div className="bg-[#0B0E29] text-white rounded-[24px] p-7 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-brand-orange text-xs font-bold">
                  Lijemrakel Trading PLC
                </span>
                <h3 className="font-heading text-xl font-bold text-white leading-snug">
                  Interested in our veterinary or poultry solutions?
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Connect directly with our technical and international business team for product inquiries or supplier partnerships.
                </p>
                <div className="pt-2">
                  <SplitPillButton
                    href="/contact"
                    label="Inquire Now"
                    variant="dark"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
