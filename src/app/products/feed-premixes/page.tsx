import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPageTemplate } from '@/components/products/CategoryPageTemplate';
import { getCategoryBySlug } from '@/data/productCategories';
import { getProductsByCategory } from '@/data/catalogueProducts';
import { readDb } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Feed Premixes — Poultry & Livestock Nutritional Premixes',
  description:
    'Poultry and livestock vitamin-mineral premixes and approved nutritional formulations with verified inclusion rates and composition.',
};

export default function FeedPremixesPage() {
  const category = getCategoryBySlug('feed-premixes');
  if (!category) notFound();
  const db = readDb();
  const liveProducts = db.products.filter(
    (p) => p.categorySlug === 'feed-premixes'
  );
  const products =
    liveProducts.length > 0
      ? liveProducts
      : getProductsByCategory('feed-premixes');

  return <CategoryPageTemplate category={category} products={products} />;
}
