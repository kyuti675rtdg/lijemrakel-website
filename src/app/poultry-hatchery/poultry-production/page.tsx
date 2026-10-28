import type { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { SplitPillButton } from '@/components/ui/SplitPillButton';

export const metadata: Metadata = {
  title: 'Poultry Production — Poultry & Hatchery Division',
  description:
    'Planned modern poultry production operations by Lijemrakel Trading PLC.',
};

const FOCUS_POINTS = [
  'Feasibility, site selection, and biosecure poultry house design',
  'Integration with our veterinary vaccine, medicine, and feed premix supply lines',
  'Strict flock health monitoring and preventative immunization programs',
  'Contribution to national food security and Gebeta Le Hager priorities',
];

export default function PoultryProductionPage() {
  return (
    <div className="bg-white">
      <PageHeroBanner
        eyebrow="Poultry & Hatchery"
        title="Poultry Production"
        description="Developing modern commercial poultry production capabilities anchored in biosecurity, balanced nutrition, and veterinary oversight."
        statusBadge="Planned Phase 3 (Years 2–3)"
        breadcrumbs={[
          { label: 'Poultry & Hatchery', href: '/poultry-hatchery' },
          { label: 'Poultry Production' },
        ]}
      />

      <section className="py-16 lg:py-24 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-[24px] p-8 sm:p-10 shadow-2xs">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F3] text-xs font-bold text-brand-navy">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Strategic Focus Areas</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy">
                Modern commercial poultry management
              </h2>
              <p className="text-sm sm:text-base text-brand-body leading-relaxed">
                As part of Phase 3 of our strategic roadmap, Lijemrakel Trading PLC is preparing to establish modern poultry production facilities that leverage our veterinary and nutritional expertise.
              </p>
              <ul className="space-y-3 pt-2">
                {FOCUS_POINTS.map((pt, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-[16px] bg-[#F7F7F3] text-xs sm:text-sm text-brand-body"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-72 sm:h-80 w-full rounded-[20px] overflow-hidden bg-[#0B0E29]">
                <Image
                  src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&q=85"
                  alt="Poultry Production"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-[#0B0E29] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold">
                Explore Hatchery Development or Partner With Us
              </h3>
              <p className="text-sm text-white/75 mt-1">
                Learn how our planned hatchery infrastructure complements poultry production.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <SplitPillButton
                href="/poultry-hatchery/hatchery-development"
                label="Hatchery Development"
                variant="light"
              />
              <SplitPillButton
                href="/contact?type=poultry-hatchery-partnership"
                label="Inquire Now"
                variant="dark"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
