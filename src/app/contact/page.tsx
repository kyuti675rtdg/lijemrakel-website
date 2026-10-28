import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Handshake,
} from 'lucide-react';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { BusinessInquiryForm } from '@/components/contact/BusinessInquiryForm';

export const metadata: Metadata = {
  title: 'Contact Us — Lijemrakel Trading PLC',
  description:
    'Contact Lijemrakel Trading PLC for veterinary and poultry product inquiries, supplier partnerships, and business discussions.',
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <PageHeroBanner
        eyebrow="Contact Us"
        title="Get in Touch With Our Team"
        description="Connect with Lijemrakel Trading PLC for veterinary and poultry product inquiries, international supplier partnerships, and distribution discussions."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="py-16 lg:py-24 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (5 cols): Contact Information + Inquiry Highlights */}
            <div className="lg:col-span-5 space-y-5">
              {/* Contact Information Card */}
              <div className="bg-[#0B0E29] text-white rounded-[24px] p-7 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                    Contact Information
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-white mt-1">
                    Lijemrakel Trading PLC
                  </h2>
                </div>

                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-white/10 text-brand-orange flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-white block">
                        Office Location
                      </span>
                      <span className="text-white/85 text-xs sm:text-sm block">
                        Debrewerk Tower | Mexico | ደብረወርቅ ህንጻ | ሜክሲኮ
                      </span>
                      <span className="text-white/60 text-xs block mt-0.5">
                        Addis Ababa, Ethiopia
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-white/10 text-brand-orange flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-white block">
                        Phone
                      </span>
                      <a
                        href="tel:0913514767"
                        className="text-white/85 hover:text-brand-orange transition-colors text-xs sm:text-sm font-semibold"
                      >
                        0913514767
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-white/10 text-brand-orange flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-white block">
                        Email
                      </span>
                      <span className="text-white/75 text-xs sm:text-sm">
                        inquiries@lijemrakel.com
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-white/10 text-brand-orange flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-white block">
                        Business Hours
                      </span>
                      <span className="text-white/75 text-xs sm:text-sm">
                        Mon – Fri: 8:30 AM – 5:30 PM | Sat: 8:30 AM – 12:30 PM
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Compact Product Inquiries & Supplier Partnerships Cards */}
              <div className="bg-white rounded-[24px] p-6 shadow-2xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#F7F7F3] text-brand-navy flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-brand-navy">
                    Product Inquiries
                  </h3>
                  <p className="text-xs text-brand-body mt-1 leading-relaxed">
                    Supply support for veterinary clinics, livestock farms, poultry producers, and regional distributors.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-2xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-orange/20 text-brand-navy flex items-center justify-center shrink-0">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-brand-navy">
                    Supplier Partnerships
                  </h3>
                  <p className="text-xs text-brand-body mt-1 leading-relaxed">
                    Import representation and distribution partnerships for international veterinary and poultry suppliers.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Simple & Clean Contact Form */}
            <div className="lg:col-span-7">
              <Suspense
                fallback={
                  <div className="bg-white rounded-[24px] p-8 text-sm text-brand-muted">
                    Loading contact form...
                  </div>
                }
              >
                <BusinessInquiryForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
