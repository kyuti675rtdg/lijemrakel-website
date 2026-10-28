import type { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { SplitPillButton } from '@/components/ui/SplitPillButton';

export const metadata: Metadata = {
  title: 'Hatchery Development — Poultry & Hatchery Division',
  description:
    'Planned biosecure hatchery development and day-old chick supply by Lijemrakel Trading PLC.',
};

const HATCHERY_FOCUS = [
  'High-hygiene egg receiving, grading, and climate-controlled pre-storage',
  'Modern multi-stage or single-stage incubation and hatcher equipment',
  'Hatchery vaccination, chick grading, and biosecure dispatch protocols',
  'Technical support for commercial broiler and layer farms across Ethiopia',
];

export default function HatcheryDevelopmentPage() {
  return (
    <div className="bg-white">
      <PageHeroBanner
        eyebrow="Poultry & Hatchery"
        title="Hatchery Development"
        description="Building upon our active fertilized hatching egg import business to develop modern domestic hatchery capacity."
        statusBadge="Planned Phase 3 (Years 2–3)"
        breadcrumbs={[
          { label: 'Poultry & Hatchery', href: '/poultry-hatchery' },
          { label: 'Hatchery Development' },
        ]}
      />

      <section className="py-16 lg:py-24 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-[24px] p-8 sm:p-10 shadow-2xs">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F3] text-xs font-bold text-brand-navy">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Hatchery Infrastructure</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy">
                Biosecure incubation &amp; chick quality assurance
              </h2>
              <p className="text-sm sm:text-base text-brand-body leading-relaxed">
                Lijemrakel Trading PLC currently supplies certified fertilized hatching eggs from reputable international parent-stock breeders while planning Phase 3 domestic hatchery operations.
              </p>
              <ul className="space-y-3 pt-2">
                {HATCHERY_FOCUS.map((pt, idx) => (
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
                  src="https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1000&q=85"
                  alt="Hatchery Development"
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
                Active Fertilized Egg Import &amp; Future Hatchery Partnerships
              </h3>
              <p className="text-sm text-white/75 mt-1">
                Inquire about current fertilized hatching egg supply or Phase 3 hatchery collaboration.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <SplitPillButton
                href="/products/fertilized-eggs"
                label="Fertilized Eggs"
                variant="light"
              />
              <SplitPillButton
                href="/contact?type=poultry-hatchery-partnership"
                label="Partner With Us"
                variant="dark"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
