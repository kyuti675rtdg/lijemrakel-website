import { ShieldAlert } from 'lucide-react';
import { PRODUCT_PORTFOLIO_DISCLAIMER } from '@/data/productCategories';

interface RegulatoryNoticeBannerProps {
  customText?: string;
}

export function RegulatoryNoticeBanner({ customText }: RegulatoryNoticeBannerProps) {
  return (
    <div className="rounded-lg bg-brand-neutral border border-brand-border border-l-4 border-l-brand-gold p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-brand-goldDark shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-brand-body leading-relaxed">
          <strong className="font-heading font-bold text-brand-navy block mb-0.5">
            Regulatory &amp; Catalogue Verification Notice
          </strong>
          {customText || PRODUCT_PORTFOLIO_DISCLAIMER}
        </div>
      </div>
    </div>
  );
}
