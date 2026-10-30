import Link from 'next/link';
import Image from 'next/image';
import {
  ThermometerSnowflake,
  ChevronsRight,
  MessageSquarePlus,
} from 'lucide-react';
import { ProductItem } from '@/types';

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="bg-[#F7F7F3] rounded-[24px] p-3 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Top Rounded Image Container */}
      <div className="relative h-48 w-full rounded-[18px] bg-[#0B0E29] overflow-hidden">
        <Image
          key={product.image}
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E29]/85 via-transparent to-transparent" />

        {/* Top Pill Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#0B0E29]/90 text-white backdrop-blur-xs">
            {product.categoryName}
          </span>
          {product.coldChainRequired && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-brand-orange text-brand-navy shadow-xs">
              <ThermometerSnowflake className="w-3.5 h-3.5" />
              <span>Cold-Chain</span>
            </span>
          )}
        </div>

        {/* Subcategory Pill on bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="font-semibold bg-white/15 backdrop-blur-md px-3 py-1 rounded-full">
            {product.subcategory || product.classification}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="font-heading text-lg font-bold text-brand-navy group-hover:text-brand-goldDark transition-colors leading-snug">
            <Link href={`/products/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-brand-body line-clamp-2 leading-relaxed">
            {product.approvedIndicationsSummary}
          </p>

          {/* Key Metadata Specs */}
          <div className="pt-3 border-t border-brand-border/80 space-y-1 text-xs">
            <div>
              <span className="font-semibold text-brand-navy">Form: </span>
              <span className="text-brand-muted line-clamp-1">
                {product.dosageForm}
              </span>
            </div>
            <div>
              <span className="font-semibold text-brand-navy">Species: </span>
              <span className="text-brand-body font-medium">
                {product.intendedSpecies.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Pill CTAs */}
        <div className="pt-3 flex items-center gap-2.5">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-brand-border hover:bg-[#0B0E29] hover:text-white text-brand-navy text-xs font-heading font-bold transition-colors"
          >
            <span>Specifications</span>
            <ChevronsRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/contact?product=${product.slug}&type=product-inquiry`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-brand-navy text-xs font-heading font-bold transition-colors"
            title={`Inquire about ${product.name}`}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Inquire</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
