import { Clock, AlertCircle } from 'lucide-react';

interface PlannedStatusBadgeProps {
  variant?: 'inline' | 'banner';
  title?: string;
  description?: string;
}

export function PlannedStatusBadge({
  variant = 'inline',
  title = 'Planned Strategic Development (Phase 3 — Years 2–3)',
  description = 'Poultry production and hatchery operations are planned long-term business development lines for Lijemrakel Trading PLC. In accordance with corporate governance standards, these activities are clearly presented as planned developments rather than active operational facilities until feasibility, permitting, and infrastructure milestones are completed.',
}: PlannedStatusBadgeProps) {
  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-brand-goldLight text-brand-goldDark border border-brand-gold">
        <Clock className="w-3.5 h-3.5 text-brand-orange shrink-0" />
        <span>Planned Development</span>
      </span>
    );
  }

  return (
    <div
      role="status"
      className="rounded-lg bg-brand-goldLight border-l-4 border-brand-orange p-5 sm:p-6 shadow-sm"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-md bg-brand-navy text-brand-gold flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-navy text-brand-gold">
              OPERATING STATUS DISCLOSURE
            </span>
            <h3 className="font-heading text-base sm:text-lg font-bold text-brand-navy">
              {title}
            </h3>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-brand-body leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
