'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  ThermometerSnowflake,
  ChevronsRight,
  Sparkles,
} from 'lucide-react';
import { ProductCategory, ProductItem } from '@/types';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { ProductCard } from './ProductCard';
import { PRODUCT_CATEGORIES } from '@/data/productCategories';
import { SplitPillButton } from '@/components/ui/SplitPillButton';
import { usePublicCms } from '@/lib/usePublicCms';

interface CategoryPageTemplateProps {
  category: ProductCategory;
  products: ProductItem[];
}

export function CategoryPageTemplate({
  category,
  products: initialProducts,
}: CategoryPageTemplateProps) {
  const { products: allProducts } = usePublicCms();
  const liveCategoryProducts = allProducts.filter((p) => {
    if (category.slug === 'vaccines') {
      return (
        p.categorySlug === 'vaccines' ||
        (p.categorySlug as string) === 'veterinary-vaccines'
      );
    }
    return p.categorySlug === category.slug;
  });
  const products =
    liveCategoryProducts.length > 0 ? liveCategoryProducts : initialProducts;

  return (
    <div className="bg-white">
      <PageHeroBanner
        eyebrow="Product Division"
        title={category.name}
        description={category.tagline}
        statusBadge={
          category.coldChainSensitive ? 'Cold-Chain Controlled' : undefined
        }
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: category.shortName },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <SplitPillButton
            href={`/contact?type=product-inquiry&category=${category.slug}`}
            label={`Inquire About ${category.shortName}`}
            variant="dark"
          />
        </div>
      </PageHeroBanner>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Category Overview Bento Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F3] border border-brand-border text-xs font-bold text-brand-navy">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Division Overview</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy">
                {category.name}
              </h2>

              <p className="text-sm sm:text-base text-brand-body leading-relaxed">
                {category.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {category.keyRequirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-[16px] bg-[#F7F7F3] text-xs text-brand-body"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[24px] overflow-hidden bg-[#0B0E29] p-3">
                <div className="relative h-64 sm:h-72 w-full rounded-[18px] overflow-hidden">
                  <Image
                    key={category.heroImage}
                    src={category.heroImage}
                    alt={category.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                  {category.coldChainSensitive && (
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange text-brand-navy text-xs font-bold">
                      <ThermometerSnowflake className="w-3.5 h-3.5" />
                      <span>Cold-Chain</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F3] border border-brand-border text-xs font-bold text-brand-navy mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Available Specifications</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy">
                  {category.name} ({products.length})
                </h2>
              </div>
              <SplitPillButton
                href="/products"
                label="View All Products"
                variant="light"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Other Product Categories Strip */}
          <div className="pt-8 border-t border-brand-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {PRODUCT_CATEGORIES.map((cat) => {
                const isCurrent = cat.slug === category.slug;
                return (
                  <Link
                    key={cat.slug}
                    href={`/products/${cat.slug}`}
                    className={`px-4 py-3.5 rounded-full text-xs font-heading font-bold flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-[#0B0E29] text-white'
                        : 'bg-[#F7F7F3] text-brand-navy hover:bg-brand-orange'
                    }`}
                  >
                    <span>{cat.shortName}</span>
                    <ChevronsRight className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
