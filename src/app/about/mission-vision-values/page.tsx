'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Eye,
  Sparkles,
  ShieldCheck,
  Scale,
  Sprout,
  HeartHandshake,
  Award,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { COMPANY_PROFILE } from '@/data/companyProfile';
import { SplitPillButton } from '@/components/ui/SplitPillButton';
import { FadeIn } from '@/components/ui/MotionWrapper';

const VALUE_ICONS: Record<string, React.ComponentType<{ className?: string }>> =
  {
    ShieldCheck,
    Scale,
    Sprout,
    HeartHandshake,
    Award,
    Globe2: Globe,
    TrendingUp,
  };

export default function MissionVisionValuesPage() {
  return (
    <div className="bg-white">
      <PageHeroBanner
        title="Mission, Vision & Values"
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Mission & Vision' },
        ]}
      />

      <section className="py-12 lg:py-16 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* =================================================================
              1. ANIMATED MISSION & VISION COMPACT CARDS
          ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OUR MISSION — Animated White Bento Card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="relative rounded-[24px] bg-white p-7 sm:p-8 shadow-2xs border border-brand-border/60 overflow-hidden group"
            >
              {/* Subtle Animated Corner Accent */}
              <div
                className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-orange/15 group-hover:scale-125 transition-transform duration-500"
                aria-hidden="true"
              />

              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-orange text-brand-navy flex items-center justify-center shrink-0 shadow-2xs group-hover:rotate-6 transition-transform duration-300">
                  <Compass className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <span className="inline-block text-[11px] font-heading font-bold uppercase tracking-widest text-brand-goldDark">
                    Our Mission
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-brand-navy leading-snug">
                    Reliable Sourcing &amp; Responsible Distribution
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-body leading-relaxed pt-1">
                    {COMPANY_PROFILE.mission}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* OUR VISION — Animated Deep Navy Bento Card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              className="relative rounded-[24px] bg-[#0B0E29] text-white p-7 sm:p-8 shadow-2xs overflow-hidden group"
            >
              {/* Subtle Animated Corner Glow */}
              <div
                className="pointer-events-none absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-brand-orange/15 group-hover:scale-125 transition-transform duration-500"
                aria-hidden="true"
              />

              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-brand-orange flex items-center justify-center shrink-0 group-hover:bg-brand-orange group-hover:text-brand-navy transition-colors duration-300">
                  <Eye className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <span className="inline-block text-[11px] font-heading font-bold uppercase tracking-widest text-brand-orange">
                    Our Vision
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white leading-snug">
                    Trusted Supply &amp; Competitive Poultry Growth
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-1">
                    {COMPANY_PROFILE.vision}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* =================================================================
              2. COMPACT ANIMATED CORE VALUES GRID (SHORT & SCANNABLE)
          ================================================================= */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F7F3] text-xs font-bold text-brand-navy">
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Core Values</span>
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-extrabold text-brand-navy">
                  Principles Guiding Our Operations
                </h3>
              </div>

              <SplitPillButton
                href="/about/strategy"
                label="Our Strategy"
                variant="light"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {COMPANY_PROFILE.coreValues.map((value, idx) => {
                const IconComp = VALUE_ICONS[value.iconName] || ShieldCheck;
                return (
                  <FadeIn key={value.id} delay={idx * 0.05}>
                    <div className="h-full rounded-[18px] bg-[#F7F7F3] hover:bg-[#0B0E29] hover:text-white p-4 transition-colors duration-250 group flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white group-hover:bg-brand-orange text-brand-navy flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-heading text-sm font-bold text-brand-navy group-hover:text-white">
                          {value.title}
                        </h4>
                        <p className="text-xs text-brand-body group-hover:text-white/75 mt-1 line-clamp-2 leading-snug">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
