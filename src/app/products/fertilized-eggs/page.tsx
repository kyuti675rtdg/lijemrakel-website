import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPageTemplate } from '@/components/products/CategoryPageTemplate';
import { getCategoryBySlug } from '@/data/productCategories';
import { getProductsByCategory } from '@/data/catalogueProducts';
import { readDb } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Fertilized Eggs — Certified Poultry Hatching Eggs',
  description:
    'Certified fertilized hatching eggs for poultry production, subject to supplier documentation, veterinary certification, biosecurity, and climate-controlled transport.',
};

export default function FertilizedEggsPage() {
  const category = getCategoryBySlug('fertilized-eggs');
  if (!category) notFound();
  const db = readDb();
  const liveProducts = db.products.filter(
    (p) => p.categorySlug === 'fertilized-eggs'
  );
  const products =
    liveProducts.length > 0
      ? liveProducts
      : getProductsByCategory('fertilized-eggs');

  return <CategoryPageTemplate category={category} products={products} />;
}
