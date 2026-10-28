import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroBannerProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  statusBadge?: string;
  children?: React.ReactNode;
}

export function PageHeroBanner({
  title,
  breadcrumbs,
  statusBadge,
}: PageHeroBannerProps) {
  return (
    <section className="bg-[#0B0E29] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Title Only */}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
          {statusBadge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-orange text-brand-navy">
              {statusBadge}
            </span>
          )}
        </div>

        {/* Right: Clean Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="shrink-0">
          <ol className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/75">
            <li>
              <Link href="/" className="hover:text-brand-orange transition-colors">
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <ChevronRight
                  className="w-3.5 h-3.5 text-brand-orange"
                  aria-hidden="true"
                />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-brand-orange transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="text-brand-orange font-semibold"
                    aria-current="page"
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
