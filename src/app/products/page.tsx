import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronsRight } from 'lucide-react';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { CatalogueBrowser } from '@/components/products/CatalogueBrowser';
import { PRODUCT_CATEGORIES } from '@/data/productCategories';

export const metadata: Metadata = {
  title: 'Products — Veterinary Medicines, Vaccines, Premixes, Hormones & Eggs',
  description:
    'Search and filter Lijemrakel Trading PLC’s veterinary medicines, vaccines, feed premixes, hormones, and fertilized hatching eggs.',
};

export default function ProductsPage() {
  return (
    <div className="bg-white">
      <PageHeroBanner
        eyebrow="Products"
        title="Veterinary & Poultry Product Catalogue"
        description="Explore our five core import categories: Veterinary Medicines, Vaccines, Feed Premixes, Hormones, and Fertilized Eggs."
        breadcrumbs={[{ label: 'Products' }]}
      >
        <div className="flex flex-wrap gap-2.5">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-brand-orange hover:text-brand-navy text-white text-xs font-heading font-bold transition-colors"
            >
              <span>{cat.shortName}</span>
              <ChevronsRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
      </PageHeroBanner>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CatalogueBrowser />
        </div>
      </section>
    </div>
  );
}
