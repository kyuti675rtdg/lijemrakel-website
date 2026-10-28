import Link from 'next/link';
import { ArrowLeft, Compass, PackageSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="py-20 lg:py-28 bg-brand-neutral">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-widest bg-brand-navy text-brand-gold mb-4">
          HTTP 404 • PAGE NOT FOUND
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy">
          The requested page could not be located
        </h1>
        <p className="mt-4 text-base text-brand-body leading-relaxed">
          The URL you visited may have moved or does not exist in the Lijemrakel Trading PLC corporate portal. Use the quick links below to return to our homepage or browse our veterinary and poultry product portfolio.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand-navy text-white font-heading font-semibold text-sm hover:bg-brand-navyLight transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-brand-gold" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand-orange text-brand-navy font-heading font-bold text-sm hover:bg-brand-orangeHover transition-colors"
          >
            <PackageSearch className="w-4 h-4" />
            <span>Explore Product Catalogue</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-brand-border bg-white text-brand-navy font-heading font-semibold text-sm hover:border-brand-gold transition-colors"
          >
            <Compass className="w-4 h-4 text-brand-goldDark" />
            <span>Contact Us</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
