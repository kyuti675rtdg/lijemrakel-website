import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPageTemplate } from '@/components/products/CategoryPageTemplate';
import { getCategoryBySlug } from '@/data/productCategories';
import { getProductsByCategory } from '@/data/catalogueProducts';

export const metadata: Metadata = {
  title: 'Veterinary Medicines — Anthelmintics, Antibiotics, Antiprotozoals & Supplements',
  description:
    'Veterinary medicines category portfolio at Lijemrakel Trading PLC: anthelmintics (dewormers), antibiotics, antiprotozoals, and multivitamins/nutritional supplements.',
};

export default function VeterinaryMedicinesPage() {
  const category = getCategoryBySlug('veterinary-medicines');
  if (!category) notFound();
  const products = getProductsByCategory('veterinary-medicines');

  return <CategoryPageTemplate category={category} products={products} />;
}
