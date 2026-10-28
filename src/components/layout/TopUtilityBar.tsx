import Link from 'next/link';
import { CheckCircle2, MapPin, Globe, Building2, PhoneCall } from 'lucide-react';

export function TopUtilityBar() {
  return (
    <div className="bg-brand-orange text-brand-navy text-xs font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
        {/* Left: Company Positioning + Phone & Location */}
        <div className="flex items-center gap-5 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-navy shrink-0 fill-brand-navy text-brand-orange" />
            <span>Trusted Veterinary &amp; Agricultural Import–Export Partner</span>
          </div>

          <a
            href="tel:0913514767"
            className="inline-flex items-center gap-1.5 font-bold hover:underline"
          >
            <PhoneCall className="w-3.5 h-3.5 shrink-0" />
            <span>0913514767</span>
          </a>

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-1.5 font-semibold hover:underline"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>Debrewerk Tower | Mexico | ደብረወርቅ ህንጻ | ሜክሲኮ</span>
          </Link>
        </div>

        {/* Right: Follow / Quick Corporate Links */}
        <div className="hidden lg:flex items-center gap-3.5 shrink-0 font-semibold">
          <span>Connect —</span>
          <div className="flex items-center gap-2.5">
            <Link
              href="/products"
              aria-label="Global Product Catalogue"
              title="Product Catalogue"
              className="hover:opacity-75 transition-opacity"
            >
              <Globe className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/about"
              aria-label="About Lijemrakel Trading PLC"
              title="About Us"
              className="hover:opacity-75 transition-opacity"
            >
              <Building2 className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              aria-label="Business Inquiries"
              title="Contact Desk"
              className="hover:opacity-75 transition-opacity"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
