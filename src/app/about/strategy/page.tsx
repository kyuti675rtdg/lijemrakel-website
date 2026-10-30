import type { Metadata } from 'next';
import Image from 'next/image';
import { Clock, CheckCircle2 } from 'lucide-react';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { STRATEGY_PHASES } from '@/data/strategyPhases';
import { FadeIn } from '@/components/ui/MotionWrapper';
import {
  readDb,
  DEFAULT_SITE_IMAGES,
  getRouteSeoMetadata,
} from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return getRouteSeoMetadata('/about/strategy', {
    title: 'Our Strategy — Lijemrakel Trading PLC',
    description:
      'Explore the four-phase strategic roadmap of Lijemrakel Trading PLC.',
  });
}

export default function StrategyPage() {
  const db = readDb();
  const siteImages = { ...DEFAULT_SITE_IMAGES, ...(db.siteImages || {}) };
  const PHASE_IMAGES = [
    siteImages.strategyPhase1Image,
    siteImages.strategyPhase2Image,
    siteImages.strategyPhase3Image,
    siteImages.strategyPhase4Image,
  ];

  return (
    <div className="bg-white">
      <PageHeroBanner
        title="Our Strategy"
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Our Strategy' },
        ]}
      />

      <section className="py-12 lg:py-16 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {STRATEGY_PHASES.map((phase, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <FadeIn key={phase.phaseNumber}>
                <article
                  className={`rounded-[28px] p-6 sm:p-8 lg:p-10 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center ${
                    idx === 2
                      ? 'bg-[#0B0E29] text-white'
                      : 'bg-white text-brand-navy'
                  }`}
                >
                  {/* Phase Image */}
                  <div
                    className={`lg:col-span-5 relative h-64 sm:h-72 lg:h-80 w-full rounded-[22px] overflow-hidden bg-[#0B0E29] ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <Image
                      key={PHASE_IMAGES[idx]}
                      src={PHASE_IMAGES[idx]}
                      alt={`Phase ${phase.phaseNumber}: ${phase.title}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      <span className="px-3.5 py-1.5 rounded-full bg-brand-orange text-brand-navy text-xs font-heading font-extrabold">
                        Phase {phase.phaseNumber}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0B0E29]/85 backdrop-blur-md text-white text-xs font-semibold border border-white/15">
                        <Clock className="w-3.5 h-3.5 text-brand-orange" />
                        {phase.timeframe}
                      </span>
                    </div>
                  </div>

                  {/* Original Company Strategy Content */}
                  <div
                    className={`lg:col-span-7 space-y-5 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div>
                      <span
                        className={`text-xs font-heading font-bold uppercase tracking-widest ${
                          idx === 2 ? 'text-brand-orange' : 'text-brand-goldDark'
                        }`}
                      >
                        Phase {phase.phaseNumber} ({phase.timeframe})
                      </span>
                      <h2
                        className={`font-heading text-2xl sm:text-3xl font-extrabold mt-1 ${
                          idx === 2 ? 'text-white' : 'text-brand-navy'
                        }`}
                      >
                        {phase.title}
                      </h2>
                    </div>

                    <ul className="space-y-3">
                      {phase.milestones.map((m, i) => (
                        <li
                          key={i}
                          className={`flex items-start gap-2.5 p-3.5 rounded-[16px] text-xs sm:text-sm leading-relaxed ${
                            idx === 2
                              ? 'bg-white/10 text-white/90'
                              : 'bg-[#F7F7F3] text-brand-navy'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </div>
  );
}
