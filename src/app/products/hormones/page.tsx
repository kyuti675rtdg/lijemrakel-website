import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPageTemplate } from '@/components/products/CategoryPageTemplate';
import { getCategoryBySlug } from '@/data/productCategories';
import { getProductsByCategory } from '@/data/catalogueProducts';

export const metadata: Metadata = {
  title: 'Hormones and Related Products — Authorized Veterinary Applications',
  description:
    'Veterinary hormonal products for authorized reproductive or herd-management applications, supplied strictly where registered and legally permitted.',
};

export default function HormonesPage() {
  const category = getCategoryBySlug('hormones');
  if (!category) notFound();
  const products = getProductsByCategory('hormones');

  return <CategoryPageTemplate category={category} products={products} />;
}
