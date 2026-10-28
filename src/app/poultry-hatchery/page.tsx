import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  ChevronsRight,
  Sparkles,
  Egg,
  Warehouse,
} from 'lucide-react';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { SplitPillButton } from '@/components/ui/SplitPillButton';

export const metadata: Metadata = {
  title: 'Poultry & Hatchery — Poultry Production & Hatchery Development',
  description:
    'Explore Lijemrakel Trading PLC’s planned Poultry Production and Hatchery Development operations.',
};

const POULTRY_POINTS = [
  'Commercial layer and broiler farm planning with modern housing and climate control',
  'Balanced nutrition programs using verified vitamin-mineral and amino acid premixes',
  'Veterinary-supervised flock health, vaccination schedules, and farm biosecurity',
  'Alignment with national agricultural priorities including Gebeta Le Hager',
];

const HATCHERY_POINTS = [
  'Modern setter and hatcher incubation systems with automated climate control',
  'Sourcing certified fertilized hatching eggs from healthy parent-stock flocks',
  'Strict hatchery sanitation, egg fumigation, and day-old chick quality grading',
  'Technical guidance and chick delivery support for commercial poultry farmers',
];

const BIOSECURITY_STANDARDS = [
  'Strict all-in, all-out flock management and sanitation protocols',
  'Veterinary health certification and traceability for all hatching eggs',
  'Continuous cold-chain and climate monitoring during storage and transport',
  'Dedicated veterinary technical oversight led by Dr Etsubdink Negash',
];

export default function PoultryHatcheryPage() {
  return (
    <div className="bg-white">
      <PageHeroBanner
        eyebrow="Poultry & Hatchery"
        title="Poultry Production & Hatchery Development"
        description="Building on our active veterinary and fertilized egg import operations, Lijemrakel Trading PLC is advancing long-term investments in modern poultry production and hatchery infrastructure."
        statusBadge="Planned Phase 3 Development"
        breadcrumbs={[{ label: 'Poultry & Hatchery' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/poultry-hatchery/poultry-production"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-orange text-brand-navy text-xs font-heading font-bold"
          >
            <span>Poultry Production</span>
            <ChevronsRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/poultry-hatchery/hatchery-development"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-heading font-semibold transition-colors"
          >
            <span>Hatchery Development</span>
            <ChevronsRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </PageHeroBanner>

      <section className="py-16 lg:py-24 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* 2 Core Bento Cards: Poultry Production & Hatchery Development */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Poultry Production Card */}
            <div className="rounded-[24px] bg-white p-8 sm:p-10 flex flex-col justify-between shadow-2xs">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F7F3] text-brand-navy flex items-center justify-center">
                    <Warehouse className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-brand-orange text-brand-navy text-xs font-bold">
                    Planned Phase 3
                  </span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy">
                  Poultry Production
                </h2>

                <p className="text-sm sm:text-base text-brand-body leading-relaxed">
                  Developing modern, biosecure poultry farm operations to support domestic egg and poultry meat supply across Ethiopia.
                </p>

                <ul className="pt-4 border-t border-brand-border space-y-2.5">
                  {POULTRY_POINTS.map((pt, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-body"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <SplitPillButton
                  href="/poultry-hatchery/poultry-production"
                  label="Explore Poultry Production"
                  variant="dark"
                />
              </div>
            </div>

            {/* Hatchery Development Card */}
            <div className="rounded-[24px] bg-[#0B0E29] text-white p-8 sm:p-10 flex flex-col justify-between shadow-2xs">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange text-brand-navy flex items-center justify-center">
                    <Egg className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-brand-orange text-xs font-bold">
                    Planned Phase 3
                  </span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  Hatchery Development
                </h2>

                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  Establishing high-hygiene incubation and hatchery facilities to supply healthy, vaccinated day-old chicks to Ethiopian poultry producers.
                </p>

                <ul className="pt-4 border-t border-white/15 space-y-2.5">
                  {HATCHERY_POINTS.map((pt, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-white/85"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <SplitPillButton
                  href="/poultry-hatchery/hatchery-development"
                  label="Explore Hatchery Development"
                  variant="light"
                />
              </div>
            </div>
          </div>

          {/* Biosecurity & Partnership Strip */}
          <div className="rounded-[24px] bg-white p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F3] text-xs font-bold text-brand-navy">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Biosecurity &amp; Technical Standards</span>
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-brand-navy">
                Building sustainable domestic poultry capacity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {BIOSECURITY_STANDARDS.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 rounded-[16px] bg-[#F7F7F3] text-xs text-brand-body"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 rounded-[20px] overflow-hidden bg-[#0B0E29]">
              <Image
                src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&q=85"
                alt="Poultry and Hatchery Development"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
