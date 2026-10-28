import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  CheckCircle2,
  ChevronsRight,
  Compass,
  Clock,
  Users,
} from 'lucide-react';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { FOUNDING_MEMBERS } from '@/data/leadershipData';
import { SplitPillButton } from '@/components/ui/SplitPillButton';
import { FadeIn } from '@/components/ui/MotionWrapper';
import { readDb, DEFAULT_SITE_IMAGES } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Company Overview — About Lijemrakel Trading PLC',
  description:
    'Learn about Lijemrakel Trading PLC, an Ethiopian veterinary and poultry import-export company.',
};

export default function AboutPage() {
  const db = readDb();
  const aboutPhoto =
    db.siteImages?.aboutOfficeImage || DEFAULT_SITE_IMAGES.aboutOfficeImage;

  return (
    <div className="bg-white dark:bg-[#070B1E] transition-colors">
      <PageHeroBanner
        eyebrow="About Us"
        title="Company Overview"
        description="Connecting dependable international manufacturers of veterinary medicines, vaccines, premixes, hormones, and fertilized eggs with Ethiopia’s agricultural sector."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* =====================================================================
          1. COMPACT BENTO COMPANY OVERVIEW
      ===================================================================== */}
      <section className="py-14 lg:py-20 bg-white dark:bg-[#070B1E] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Clean Matched-Height Visual */}
            <FadeIn direction="right" className="lg:col-span-6">
              <div className="relative h-80 sm:h-96 lg:h-[390px] w-full rounded-[24px] overflow-hidden shadow-sm">
                <Image
                  src={aboutPhoto}
                  alt="Lijemrakel Trading PLC Executive Office"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </FadeIn>

            {/* Right Column: Concise Story & Founders */}
            <FadeIn
              direction="left"
              delay={0.1}
              className="lg:col-span-6 space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F3] border border-brand-border text-xs font-bold text-brand-navy">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Who We Are</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy leading-tight">
                Reliable veterinary &amp; poultry solutions for Ethiopia
              </h2>

              <p className="text-sm sm:text-base text-brand-body leading-relaxed">
                Lijemrakel Trading PLC is an Ethiopian import and export company focused on supplying veterinary medicines, vaccines, feed premixes, hormones, and fertilized hatching eggs to clinics, farms, and distributors.
              </p>

              <p className="text-sm sm:text-base text-brand-body leading-relaxed">
                Alongside our core import operations, we are advancing long-term plans in domestic poultry production and hatchery development in alignment with national agricultural priorities including{' '}
                <strong className="text-brand-navy">Gebeta Le Hager</strong>.
              </p>

              {/* Compact Founders Strip */}
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted mb-2.5">
                  Founding Members
                </div>
                <div className="flex flex-wrap gap-2">
                  {FOUNDING_MEMBERS.map((f) => (
                    <span
                      key={f.name}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F7F7F3] text-xs font-heading font-bold text-brand-navy"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange" />
                      <span>{f.formalName}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-4">
                <SplitPillButton
                  href="/products"
                  label="Explore Products"
                  variant="dark"
                />
                <SplitPillButton
                  href="/contact"
                  label="Contact Us"
                  variant="light"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. 3 COMPACT GATEWAY CARDS (MISSION • STRATEGY • LEADERSHIP)
      ===================================================================== */}
      <section className="py-14 lg:py-20 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Mission & Vision */}
            <FadeIn delay={0}>
              <div className="relative h-full rounded-[24px] bg-white p-7 pb-20 flex flex-col justify-between shadow-2xs">
                <div>
                  <Compass className="w-9 h-9 text-brand-navy stroke-[1.5] mb-4" />
                  <h3 className="font-heading text-lg font-bold text-brand-navy">
                    Mission &amp; Vision
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-body mt-2 leading-relaxed">
                    Our core purpose, long-term vision, and the seven values guiding our operations.
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 bg-[#F7F7F3] pt-2.5 pr-3.5 rounded-tr-[20px]">
                  <Link
                    href="/about/mission-vision-values"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-brand-border text-xs font-heading font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                  >
                    <span>Explore</span>
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Card 2: Our Strategy */}
            <FadeIn delay={0.08}>
              <div className="relative h-full rounded-[24px] bg-brand-orange p-7 pb-20 flex flex-col justify-between shadow-2xs">
                <div>
                  <Clock className="w-9 h-9 text-brand-navy stroke-[1.5] mb-4" />
                  <h3 className="font-heading text-lg font-bold text-brand-navy">
                    Our Strategy
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-navy/85 mt-2 leading-relaxed">
                    Our four-phase roadmap from import foundations to poultry and hatchery operations.
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 bg-[#F7F7F3] pt-2.5 pr-3.5 rounded-tr-[20px]">
                  <Link
                    href="/about/strategy"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-orange text-xs font-heading font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                  >
                    <span>Explore</span>
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Card 3: Leadership */}
            <FadeIn delay={0.16}>
              <div className="relative h-full rounded-[24px] bg-[#0B0E29] text-white p-7 pb-20 flex flex-col justify-between shadow-2xs">
                <div>
                  <Users className="w-9 h-9 text-brand-orange stroke-[1.5] mb-4" />
                  <h3 className="font-heading text-lg font-bold text-white">
                    Leadership
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">
                    Meet our Founding Members, Board of Directors, and Executive Management Team.
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 bg-[#F7F7F3] pt-2.5 pr-3.5 rounded-tr-[20px]">
                  <Link
                    href="/about/leadership"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B0E29] text-xs font-heading font-bold text-white hover:bg-brand-orange hover:text-brand-navy transition-colors"
                  >
                    <span>Explore</span>
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
