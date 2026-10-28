import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPageTemplate } from '@/components/products/CategoryPageTemplate';
import { getCategoryBySlug } from '@/data/productCategories';
import { getProductsByCategory } from '@/data/catalogueProducts';

export const metadata: Metadata = {
  title: 'Fertilized Eggs — Certified Poultry Hatching Eggs',
  description:
    'Certified fertilized hatching eggs for poultry production, subject to supplier documentation, veterinary certification, biosecurity, and climate-controlled transport.',
};

export default function FertilizedEggsPage() {
  const category = getCategoryBySlug('fertilized-eggs');
  if (!category) notFound();
  const products = getProductsByCategory('fertilized-eggs');

  return <CategoryPageTemplate category={category} products={products} />;
}
