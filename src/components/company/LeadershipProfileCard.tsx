import Image from 'next/image';
import { CheckCircle2, Award, Building2 } from 'lucide-react';
import { ExecutiveMember } from '@/types';

interface LeadershipProfileCardProps {
  member: ExecutiveMember;
  showFullResponsibilities?: boolean;
  displayMode?: 'portrait' | 'monogram';
}

export function LeadershipProfileCard({
  member,
  showFullResponsibilities = true,
  displayMode = 'portrait',
}: LeadershipProfileCardProps) {
  const showPhoto = displayMode === 'portrait' && Boolean(member.portraitUrl);

  return (
    <article className="bg-white rounded-lg border border-brand-border shadow-corporate hover:border-brand-gold transition-all duration-300 flex flex-col overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-orange" />

      {/* Top Header */}
      <div className="p-6 sm:p-7 bg-brand-neutral/50 border-b border-brand-border">
        <div className="flex items-start gap-4 sm:gap-5">
          {showPhoto ? (
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-brand-navy border border-brand-gold/50 shrink-0 shadow-sm">
              <Image
                src={member.portraitUrl!}
                alt={`${member.displayName} — ${member.roleTitle}`}
                fill
                sizes="96px"
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div
              className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg bg-brand-navy text-white border border-brand-gold flex flex-col items-center justify-center shrink-0 shadow-sm"
              aria-label={`${member.displayName} monogram`}
            >
              <span className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-gold tracking-wider">
                {member.initials}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {member.isFoundingMember && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-navy text-brand-gold mb-2">
                <Award className="w-3 h-3" />
                <span>Founding Member</span>
              </span>
            )}

            <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-navy leading-snug">
              {member.displayName}
            </h3>
            <p className="text-sm font-semibold text-brand-goldDark mt-0.5">
              {member.roleTitle}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-brand-muted mt-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-navy/60 shrink-0" />
              <span>{member.department}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 sm:p-7 flex-1 space-y-4">
        <p className="text-sm text-brand-body leading-relaxed">
          {member.summary}
        </p>

        {showFullResponsibilities && (
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-2.5">
              Key Responsibilities
            </h4>
            <ul className="space-y-2">
              {member.responsibilities.map((resp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-body leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
