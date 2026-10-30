'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Type } from 'lucide-react';
import { usePublicCms } from '@/lib/usePublicCms';
import { LeadershipProfileCard } from './LeadershipProfileCard';

export function LeadershipTeamSection() {
  const { team } = usePublicCms();
  const [displayMode, setDisplayMode] = useState<'portrait' | 'monogram'>('portrait');

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-goldDark">
            EXECUTIVE MANAGEMENT
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy mt-2">
            Management Team &amp; Responsibilities
          </h2>
          <p className="text-base text-brand-body mt-2 leading-relaxed">
            Each member of our management team leads a dedicated operational function across veterinary technical direction, business development, international sourcing, logistics, and finance.
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-lg bg-white border border-brand-border shadow-sm shrink-0">
          <button
            type="button"
            onClick={() => setDisplayMode('portrait')}
            aria-pressed={displayMode === 'portrait'}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-heading font-bold transition-colors ${
              displayMode === 'portrait'
                ? 'bg-brand-navy text-brand-gold'
                : 'text-brand-body hover:text-brand-navy'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Portraits</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('monogram')}
            aria-pressed={displayMode === 'monogram'}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-heading font-bold transition-colors ${
              displayMode === 'monogram'
                ? 'bg-brand-navy text-brand-gold'
                : 'text-brand-body hover:text-brand-navy'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Initials</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {team.map((member) => (
          <LeadershipProfileCard
            key={member.id}
            member={member}
            showFullResponsibilities
            displayMode={displayMode}
          />
        ))}
      </div>
    </div>
  );
}
