import Link from 'next/link';
import Image from 'next/image';
import { Quote, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { COMPANY_PROFILE } from '@/data/companyProfile';

interface DirectorMessageCardProps {
  compact?: boolean;
}

export function DirectorMessageCard({ compact = false }: DirectorMessageCardProps) {
  const { directorsMessage } = COMPANY_PROFILE;

  return (
    <div className="bg-white rounded-lg border border-brand-border shadow-corporate overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-orange" />
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Executive Leadership Visual Column */}
        <div className="lg:col-span-5 bg-brand-navy text-white p-7 sm:p-9 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="rounded-lg bg-brand-navyLight border border-brand-gold/30 overflow-hidden shadow-sm">
              <div className="relative h-60 sm:h-64 w-full bg-brand-navy">
                <Image
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"
                  alt="Dr Etsubdink Negash — General and Technical Manager"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/25 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-md bg-brand-gold text-brand-navy font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                    EN
                  </div>
                  <div>
                    <div className="font-heading font-bold text-white text-base leading-tight">
                      Dr Etsubdink Negash
                    </div>
                    <div className="text-xs text-brand-gold font-medium">
                      General &amp; Technical Manager
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-2.5 text-xs text-white/85">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-gold font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Founding Leadership</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded bg-white/5 border border-white/10">
                    <div className="font-semibold text-white">Mr Lijalem Abayneh</div>
                    <div className="text-[11px] text-brand-gold">
                      Deputy General Manager
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-white/5 border border-white/10">
                    <div className="font-semibold text-white">Ato Abel Girma</div>
                    <div className="text-[11px] text-brand-gold">
                      Financial Manager
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-2 text-xs text-brand-gold font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Committed to Quality, Traceability &amp; Responsible Supply</span>
          </div>
        </div>

        {/* Right: Editorial Message Content */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <span className="text-brand-goldDark text-xs font-bold uppercase tracking-[0.18em]">
              LEADERSHIP PERSPECTIVE
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-brand-navy mt-2">
              {directorsMessage.title}
            </h3>

            <blockquote className="mt-6 p-5 rounded-md bg-brand-goldLight border-l-4 border-brand-gold text-brand-navy font-medium text-base sm:text-lg leading-relaxed">
              <Quote className="w-5 h-5 text-brand-gold/60 mb-1.5" aria-hidden="true" />
              {directorsMessage.quote}
            </blockquote>

            <div className="mt-6 space-y-4 text-sm sm:text-base text-brand-body leading-relaxed">
              <p>{directorsMessage.bodyParagraph1}</p>
              {!compact && <p>{directorsMessage.bodyParagraph2}</p>}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              {directorsMessage.signatories.map((sig) => (
                <div key={sig.name}>
                  <div className="font-heading font-bold text-brand-navy text-sm">
                    {sig.name}
                  </div>
                  <div className="text-xs text-brand-muted mt-0.5">{sig.role}</div>
                </div>
              ))}
            </div>

            {compact && (
              <Link
                href="/about/leadership"
                className="inline-flex items-center gap-2 text-sm font-heading font-bold text-brand-navy hover:text-brand-orange shrink-0 transition-colors"
              >
                <span>Our Leadership</span>
                <ArrowRight className="w-4 h-4 text-brand-orange" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
