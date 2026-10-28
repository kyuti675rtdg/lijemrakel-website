import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ChevronsRight } from 'lucide-react';
import { COMPANY_PROFILE } from '@/data/companyProfile';
import { PRODUCT_CATEGORIES } from '@/data/productCategories';

export function Footer() {
  return (
    <footer className="bg-[#0B0E29] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Column 1: Brand & Short Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-11 w-13 rounded-xl bg-white p-1 shrink-0">
                <Image
                  src="/images/logo/lijemrakel-logo.png"
                  alt="Lijemrakel Trading PLC"
                  fill
                  sizes="52px"
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="block font-heading font-extrabold text-white text-base tracking-tight leading-none">
                  Lijemrakel
                </span>
                <span className="block text-[10px] text-brand-orange font-semibold uppercase tracking-widest mt-1">
                  Trading PLC
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm">
              Ethiopian import and export company supplying veterinary medicines, vaccines, feed premixes, hormones, and fertilized eggs while developing modern poultry and hatchery operations.
            </p>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-brand-orange">
              Company
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-white/75">
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about/mission-vision-values" className="hover:text-brand-orange transition-colors">
                  Mission &amp; Vision
                </Link>
              </li>
              <li>
                <Link href="/about/strategy" className="hover:text-brand-orange transition-colors">
                  Our Strategy
                </Link>
              </li>
              <li>
                <Link href="/about/leadership" className="hover:text-brand-orange transition-colors">
                  Leadership
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-brand-orange transition-colors">
                  News &amp; Updates
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Products (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-brand-orange">
              Products &amp; Divisions
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-white/75">
              {PRODUCT_CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products/${category.slug}`}
                    className="hover:text-brand-orange transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/poultry-hatchery"
                  className="hover:text-brand-orange transition-colors"
                >
                  Poultry &amp; Hatchery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-brand-orange">
              Contact
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/75">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>Debrewerk Tower | Mexico | ደብረወርቅ ህንጻ | ሜክሲኮ</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="tel:0913514767" className="hover:text-brand-orange transition-colors font-semibold">
                  0913514767
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <span>inquiries@lijemrakel.com</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-orange text-brand-navy font-heading font-bold text-xs hover:bg-white transition-colors"
              >
                <span>Inquire Now</span>
                <ChevronsRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Bottom Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} <strong className="text-white">Lijemrakel Trading PLC</strong>. All rights reserved.
          </div>
          <div>
            Developed by{' '}
            <strong className="text-brand-orange font-semibold">
              Orbit Technology Solution PLC
            </strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
