'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, RotateCcw } from 'lucide-react';
import { COMPANY_PROFILE } from '@/data/companyProfile';

export function ComplianceChecklistInteractive() {
  const items = COMPANY_PROFILE.complianceChecklist;
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  const toggleIndex = (idx: number) => {
    setCheckedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const progressPercent = Math.round((checkedIndices.length / items.length) * 100);

  return (
    <div className="rounded-lg bg-brand-goldLight border-2 border-brand-gold p-7 sm:p-10 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-brand-navy text-brand-gold mb-2">
            MANAGEMENT SIGN-OFF GOVERNANCE (SECTION 8)
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy">
            Interactive Pre-Publication Compliance Checklist
          </h2>
          <p className="text-sm text-brand-body mt-2 leading-relaxed">
            Before live production publication, Lijemrakel Trading PLC management and Orbit Technology Solution PLC can use this interactive verification checklist to review and sign off on all ten compliance requirements:
          </p>
        </div>

        <div className="bg-white rounded-md border border-brand-gold/50 px-4 py-3 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
              Sign-Off Progress
            </div>
            <div className="font-mono text-lg font-extrabold text-brand-navy">
              {checkedIndices.length} / {items.length} ({progressPercent}%)
            </div>
          </div>
          {checkedIndices.length > 0 && (
            <button
              type="button"
              onClick={() => setCheckedIndices([])}
              className="text-xs font-semibold text-brand-navy hover:text-brand-orange inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-white border border-brand-gold/40 overflow-hidden">
        <div
          className="h-full bg-brand-navy transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {items.map((item, idx) => {
          const isChecked = checkedIndices.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleIndex(idx)}
              aria-pressed={isChecked}
              className={`flex items-start gap-3 p-4 rounded-md border text-left transition-all ${
                isChecked
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-brand-navy border-brand-gold/40 hover:border-brand-navy'
              }`}
            >
              {isChecked ? (
                <CheckSquare className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-brand-goldDark shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <span
                  className={`font-mono text-xs font-bold mr-1.5 ${
                    isChecked ? 'text-brand-gold' : 'text-brand-goldDark'
                  }`}
                >
                  {idx + 1 < 10 ? `0${idx + 1}.` : `${idx + 1}.`}
                </span>
                <span className="font-medium">{item}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
