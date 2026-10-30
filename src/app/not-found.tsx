import Link from 'next/link';
import { ArrowLeft, Compass, PackageSearch, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F5] dark:bg-[#070B1E] transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[28px] border border-brand-border/80 p-8 sm:p-12 text-center shadow-2xs space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7F7F3] border border-brand-border text-xs font-bold text-brand-navy">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>HTTP 404 · PAGE NOT FOUND</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy leading-tight">
            The requested page could not be located
          </h1>

          <p className="text-sm sm:text-base text-brand-body leading-relaxed max-w-xl mx-auto">
            The URL you visited may have moved or does not exist in the
            Lijemrakel Trading PLC corporate portal. Use the quick links below
            to return to our homepage or browse our veterinary and poultry
            product portfolio.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B0E29] text-white font-heading font-bold text-xs sm:text-sm hover:bg-brand-orange hover:text-brand-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-brand-orange" />
              <span>Return to Homepage</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-orange text-brand-navy font-heading font-bold text-xs sm:text-sm hover:bg-brand-orangeHover transition-colors"
            >
              <PackageSearch className="w-4 h-4" />
              <span>Explore Product Catalogue</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-brand-border bg-[#F7F7F3] text-brand-navy font-heading font-bold text-xs sm:text-sm hover:bg-brand-orange transition-colors"
            >
              <Compass className="w-4 h-4 text-brand-orange" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
