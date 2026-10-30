import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPageTemplate } from '@/components/products/CategoryPageTemplate';
import { getCategoryBySlug } from '@/data/productCategories';
import { getProductsByCategory } from '@/data/catalogueProducts';
import { readDb } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Veterinary Medicines — Anthelmintics, Antibiotics, Antiprotozoals & Supplements',
  description:
    'Veterinary medicines category portfolio at Lijemrakel Trading PLC: anthelmintics (dewormers), antibiotics, antiprotozoals, and multivitamins/nutritional supplements.',
};

export default function VeterinaryMedicinesPage() {
  const category = getCategoryBySlug('veterinary-medicines');
  if (!category) notFound();
  const db = readDb();
  const liveProducts = db.products.filter(
    (p) => p.categorySlug === 'veterinary-medicines'
  );
  const products =
    liveProducts.length > 0
      ? liveProducts
      : getProductsByCategory('veterinary-medicines');

  return <CategoryPageTemplate category={category} products={products} />;
}
