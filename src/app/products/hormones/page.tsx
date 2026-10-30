import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPageTemplate } from '@/components/products/CategoryPageTemplate';
import { getCategoryBySlug } from '@/data/productCategories';
import { getProductsByCategory } from '@/data/catalogueProducts';
import { readDb } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hormones and Related Products — Authorized Veterinary Applications',
  description:
    'Veterinary hormonal products for authorized reproductive or herd-management applications, supplied strictly where registered and legally permitted.',
};

export default function HormonesPage() {
  const category = getCategoryBySlug('hormones');
  if (!category) notFound();
  const db = readDb();
  const liveProducts = db.products.filter((p) => p.categorySlug === 'hormones');
  const products =
    liveProducts.length > 0 ? liveProducts : getProductsByCategory('hormones');

  return <CategoryPageTemplate category={category} products={products} />;
}
