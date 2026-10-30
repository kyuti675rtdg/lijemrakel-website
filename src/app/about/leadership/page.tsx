'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Sparkles, CheckCircle2, Award, Building2, Users } from 'lucide-react';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';
import { usePublicCms } from '@/lib/usePublicCms';

type FilterTab = 'all' | 'founders' | 'board';

export default function LeadershipPage() {
  const { team: managementTeam } = usePublicCms();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const foundingMembers = useMemo(
    () => managementTeam.filter((m) => m.isFoundingMember),
    [managementTeam]
  );

  const boardMembers = useMemo(
    () => managementTeam.filter((m) => m.isProposedBoardMember),
    [managementTeam]
  );

  const filteredLeaders = useMemo(() => {
    return managementTeam.filter((leader) => {
      if (activeTab === 'founders') return leader.isFoundingMember;
      if (activeTab === 'board') return leader.isProposedBoardMember;
      return true;
    });
  }, [managementTeam, activeTab]);

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      <PageHeroBanner
        eyebrow="Leadership"
        title="Leadership & Governance"
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Leadership' },
        ]}
      />

      {/* =====================================================================
          1. COMPACT EDITORIAL HEADER + INTERACTIVE GOVERNANCE FILTER PILLS
      ===================================================================== */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Editorial Intro */}
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-brand-border text-xs font-bold text-brand-navy shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span>Lijemrakel Trading PLC Leadership</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-brand-navy tracking-tight leading-[1.15]">
              We are the people who make up Lijemrakel Trading PLC
            </h2>

            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Our philosophy is simple: combine founding vision with veterinary
              technical expertise, international trade experience, and
              disciplined operational governance.
            </p>

            {/* Interactive Filter Tabs */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#0B0E29] text-white shadow-sm'
                    : 'bg-white text-brand-navy border border-brand-border hover:border-brand-orange/50'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-brand-orange" />
                <span>Executive Management ({managementTeam.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('founders')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-bold transition-all ${
                  activeTab === 'founders'
                    ? 'bg-[#0B0E29] text-white shadow-sm'
                    : 'bg-white text-brand-navy border border-brand-border hover:border-brand-orange/50'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-brand-orange" />
                <span>Founding Members ({foundingMembers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('board')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-bold transition-all ${
                  activeTab === 'board'
                    ? 'bg-[#0B0E29] text-white shadow-sm'
                    : 'bg-white text-brand-navy border border-brand-border hover:border-brand-orange/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-brand-orange" />
                <span>Board of Directors ({boardMembers.length})</span>
              </button>
            </div>
          </div>

          {/* =================================================================
              2. COMPACT 5-COLUMN PORTRAIT CARDS (Zero-Flicker Instant Render)
          ================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {filteredLeaders.map((leader, idx) => {
              const badgeLabel = leader.isFoundingMember
                ? 'Founder'
                : leader.isProposedBoardMember
                ? 'Board Member'
                : 'Executive';

              return (
                <div
                  key={leader.id}
                  className="group bg-white rounded-[20px] border border-brand-border/80 p-3.5 shadow-2xs hover:-translate-y-1 hover:shadow-lg hover:border-brand-orange/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Compact Portrait Container */}
                    <div className="relative h-44 w-full rounded-[14px] bg-[#0B0E29] overflow-hidden mb-3.5">
                      {leader.portraitUrl ? (
                        <Image
                          key={leader.portraitUrl}
                          src={leader.portraitUrl}
                          alt={leader.displayName}
                          fill
                          priority={idx < 5}
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-orange font-heading text-xl font-extrabold">
                          {leader.initials}
                        </div>
                      )}
                      {/* Subtle Top-Left Governance Pill */}
                      <div className="absolute top-2.5 left-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold backdrop-blur-md ${
                            leader.isFoundingMember
                              ? 'bg-[#0B0E29]/85 text-brand-orange'
                              : 'bg-white/90 text-brand-navy'
                          }`}
                        >
                          {badgeLabel}
                        </span>
                      </div>
                    </div>

                    {/* Clean Typography Below Portrait */}
                    <div className="px-1">
                      <h3 className="font-heading text-[15px] font-extrabold text-brand-navy group-hover:text-brand-orange transition-colors leading-snug">
                        {leader.displayName}
                      </h3>
                      <p className="text-xs font-bold text-brand-goldDark mt-0.5 leading-snug">
                        {leader.roleTitle}
                      </p>
                      <p className="text-xs text-brand-muted mt-2 leading-relaxed line-clamp-3">
                        {leader.summary}
                      </p>
                    </div>
                  </div>

                  {/* Key Responsibilities Preview Footer */}
                  <div className="mt-3.5 pt-3 border-t border-brand-border/60 px-1 space-y-1.5">
                    {leader.responsibilities.slice(0, 2).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-1.5 text-[11px] text-brand-body leading-snug"
                      >
                        <CheckCircle2 className="w-3 h-3 text-brand-orange shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================================
              3. COMPACT GOVERNANCE SUMMARY STRIP (Founders & Board Structure)
          ================================================================= */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Founding Members Card */}
            <div className="lg:col-span-5 rounded-[22px] bg-[#0B0E29] text-white p-6 flex flex-col justify-between shadow-md">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-brand-orange text-[11px] font-bold mb-2">
                  <Award className="w-3 h-3" />
                  <span>Founding Ownership</span>
                </div>
                <h3 className="font-heading text-lg font-extrabold text-white">
                  Founding Members
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  Original founders guiding Lijemrakel Trading PLC&apos;s
                  strategic direction.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {foundingMembers.map((founder) => (
                  <div
                    key={founder.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-7 h-7 rounded-lg bg-brand-orange text-brand-navy font-heading text-[11px] font-extrabold flex items-center justify-center overflow-hidden shrink-0">
                        {founder.portraitUrl ? (
                          <Image
                            key={founder.portraitUrl}
                            src={founder.portraitUrl}
                            alt={founder.displayName}
                            fill
                            sizes="28px"
                            className="object-cover object-top"
                          />
                        ) : (
                          <span>{founder.initials}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-white truncate">
                        {founder.displayName}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/75 text-right shrink-0">
                      {founder.roleTitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proposed Board of Directors Card */}
            <div className="lg:col-span-7 rounded-[22px] bg-white border border-brand-border/80 p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F7F7F3] border border-brand-border text-brand-navy text-[11px] font-bold mb-2">
                  <Building2 className="w-3 h-3 text-brand-orange" />
                  <span>Corporate Governance</span>
                </div>
                <h3 className="font-heading text-lg font-extrabold text-brand-navy">
                  Board of Directors (Proposed)
                </h3>
                <p className="text-xs text-brand-muted mt-1">
                  Five-member governance board uniting founding members and
                  operational executives.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {boardMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-[#FAF9F5] border border-brand-border/60 px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-7 h-7 rounded-lg bg-[#0B0E29] text-brand-orange font-heading text-[11px] font-extrabold flex items-center justify-center overflow-hidden shrink-0">
                        {member.portraitUrl ? (
                          <Image
                            key={member.portraitUrl}
                            src={member.portraitUrl}
                            alt={member.displayName}
                            fill
                            sizes="28px"
                            className="object-cover object-top"
                          />
                        ) : (
                          <span>{member.initials}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-brand-navy leading-tight truncate">
                          {member.displayName}
                        </div>
                        <div className="text-[11px] text-brand-muted truncate">
                          {member.roleTitle}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-brand-border text-[10px] font-bold text-brand-navy shrink-0">
                      {member.isFoundingMember ? 'Founder' : 'Board'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
