import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPageTemplate } from '@/components/products/CategoryPageTemplate';
import { getCategoryBySlug } from '@/data/productCategories';
import { getProductsByCategory } from '@/data/catalogueProducts';
import { readDb } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Veterinary Vaccines — Livestock & Poultry Immunization',
  description:
    'Veterinary vaccines for relevant livestock and poultry diseases, managed with strict cold-chain integrity and approved label instructions.',
};

export default function VaccinesPage() {
  const category = getCategoryBySlug('vaccines');
  if (!category) notFound();
  const db = readDb();
  const liveProducts = db.products.filter(
    (p) =>
      p.categorySlug === 'vaccines' ||
      (p.categorySlug as string) === 'veterinary-vaccines'
  );
  const products =
    liveProducts.length > 0 ? liveProducts : getProductsByCategory('vaccines');

  return <CategoryPageTemplate category={category} products={products} />;
}
