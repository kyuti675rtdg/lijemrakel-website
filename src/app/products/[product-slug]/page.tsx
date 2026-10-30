import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ThermometerSnowflake,
  ChevronsRight,
} from 'lucide-react';
import {
  CATALOGUE_PRODUCTS,
  getProductBySlug,
  getProductsByCategory,
} from '@/data/catalogueProducts';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { ProductCard } from '@/components/products/ProductCard';
import { SplitPillButton } from '@/components/ui/SplitPillButton';
import { readDb } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: {
    'product-slug': string;
  };
}

export function generateMetadata({
  params,
}: ProductDetailPageProps): Metadata {
  const db = readDb();
  const product =
    db.products.find((p) => p.slug === params['product-slug']) ||
    getProductBySlug(params['product-slug']);
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  return {
    title: `${product.name} — Products`,
    description: product.approvedIndicationsSummary,
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const db = readDb();
  const allProducts =
    Array.isArray(db.products) && db.products.length > 0
      ? db.products
      : CATALOGUE_PRODUCTS;
  const product =
    allProducts.find((p) => p.slug === params['product-slug']) ||
    getProductBySlug(params['product-slug']);
  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter(
      (p) => p.categorySlug === product.categorySlug && p.id !== product.id
    )
    .slice(0, 3);

  return (
    <div className="bg-white">
      <PageHeroBanner
        eyebrow={product.categoryName}
        title={product.name}
        description={product.approvedIndicationsSummary}
        statusBadge={product.coldChainRequired ? 'Cold-Chain' : undefined}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          {
            label: product.categoryName,
            href: `/products/${product.categorySlug}`,
          },
          { label: product.name },
        ]}
      />

      <section className="py-16 lg:py-24 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Clean 2-Column Product Overview & Specifications */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Product Visual Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-[24px] bg-white p-3 shadow-2xs">
                <div className="relative h-72 sm:h-80 w-full rounded-[18px] overflow-hidden bg-[#0B0E29]">
                  <Image
                    key={product.image}
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    unoptimized
                  />
                  {product.coldChainRequired && (
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange text-brand-navy text-xs font-bold">
                      <ThermometerSnowflake className="w-3.5 h-3.5" />
                      <span>Cold-Chain</span>
                    </div>
                  )}
                </div>
              </div>

              <Link
                href={`/products/${product.categorySlug}`}
                className="inline-flex items-center gap-2 text-xs font-heading font-bold text-brand-navy hover:text-brand-orange px-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to {product.categoryName}</span>
              </Link>
            </div>

            {/* Right Column: Clean Specifications Card */}
            <div className="lg:col-span-7 bg-white rounded-[24px] p-7 sm:p-10 shadow-2xs space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#F7F7F3] text-xs font-bold text-brand-navy">
                  {product.subcategory || product.classification}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy mt-3">
                  Product Specifications
                </h2>
              </div>

              <dl className="divide-y divide-brand-border text-sm">
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-heading font-bold text-brand-navy">
                    Composition
                  </dt>
                  <dd className="sm:col-span-2 text-brand-body">
                    {product.activeIngredientOrComposition}
                  </dd>
                </div>

                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-heading font-bold text-brand-navy">
                    Dosage Form
                  </dt>
                  <dd className="sm:col-span-2 text-brand-body">
                    {product.dosageForm}
                  </dd>
                </div>

                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-heading font-bold text-brand-navy">
                    Pack Size
                  </dt>
                  <dd className="sm:col-span-2 text-brand-body">
                    {product.packSize}
                  </dd>
                </div>

                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-heading font-bold text-brand-navy">
                    Target Species
                  </dt>
                  <dd className="sm:col-span-2 flex flex-wrap gap-1.5">
                    {product.intendedSpecies.map((sp) => (
                      <span
                        key={sp}
                        className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#F7F7F3] text-brand-navy"
                      >
                        {sp}
                      </span>
                    ))}
                  </dd>
                </div>

                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-heading font-bold text-brand-navy">
                    Indications
                  </dt>
                  <dd className="sm:col-span-2 text-brand-body leading-relaxed">
                    {product.approvedIndicationsSummary}
                  </dd>
                </div>

                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="font-heading font-bold text-brand-navy">
                    Storage
                  </dt>
                  <dd className="sm:col-span-2 text-brand-body">
                    {product.storageConditions}
                  </dd>
                </div>
              </dl>

              <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-brand-muted">
                  Contact our team for availability and supply inquiries.
                </span>
                <SplitPillButton
                  href={`/contact?product=${product.slug}&type=product-inquiry`}
                  label="Inquire About This Product"
                  variant="dark"
                />
              </div>
            </div>
          </div>

          {/* Related Products (3 Items) */}
          {relatedProducts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-extrabold text-brand-navy">
                  Related in {product.categoryName}
                </h2>
                <Link
                  href={`/products/${product.categorySlug}`}
                  className="inline-flex items-center gap-1 text-xs font-heading font-bold text-brand-navy hover:text-brand-orange"
                >
                  <span>View All</span>
                  <ChevronsRight className="w-3.5 h-3.5 text-brand-orange" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
