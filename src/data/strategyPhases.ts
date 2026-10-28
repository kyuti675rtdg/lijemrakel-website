import { StrategyPhase } from '@/types';

export const STRATEGY_FRAMEWORK_DISCLAIMER =
  'Proposed Strategic Framework: The roadmap below reflects Lijemrakel Trading PLC’s planned four-phase growth framework. Specific dates, budgets, and measurable targets are subject to management approval before publication as formal commitments.';

export const STRATEGY_PHASES: StrategyPhase[] = [
  {
    phaseNumber: 1,
    code: 'PHASE 01',
    title: 'Establish the Foundation',
    timeframe: '0–12 months',
    statusLabel: 'Foundational Priority Phase',
    summary:
      'Put in place core regulatory licenses, international supplier qualifications, quality and traceability systems, and initial market relationships.',
    milestones: [
      'Finalize company governance, licenses, tax and import/export requirements, and product authorization processes.',
      'Qualify international suppliers and document quality, storage, traceability, and complaint-handling procedures.',
      'Launch the website and a verified product catalogue.',
      'Build relationships with veterinary clinics, livestock farms, poultry farms, feed businesses, and distributors.',
      'Set up basic inventory, financial reporting, and customer-service systems.',
    ],
  },
  {
    phaseNumber: 2,
    code: 'PHASE 02',
    title: 'Expand Market Reach',
    timeframe: 'Years 1–2',
    statusLabel: 'Planned Portfolio & Distribution Growth',
    summary:
      'Broaden the registered product portfolio according to Ethiopian market demand while scaling cold-chain capacity and customer technical education.',
    milestones: [
      'Expand the authorized portfolio of veterinary medicines, vaccines, premixes, hormones, and fertilized eggs according to market demand.',
      'Strengthen distribution coverage and customer education.',
      'Improve cold-chain and warehousing capacity where required.',
      'Develop supplier partnerships and measurable service standards.',
    ],
  },
  {
    phaseNumber: 3,
    code: 'PHASE 03',
    title: 'Develop Poultry and Hatchery Operations',
    timeframe: 'Years 2–3',
    statusLabel: 'Planned Value-Chain Investment',
    summary:
      'Execute rigorous feasibility, permitting, and biosecurity planning to establish domestic poultry production and hatchery infrastructure.',
    milestones: [
      'Complete feasibility studies, financing plans, site selection, and biosecurity planning for poultry production and hatchery operations.',
      'Proceed with investment only after securing required permits, suitable infrastructure, reliable inputs, and technical oversight.',
      'Establish production, welfare, disease-prevention, and performance-monitoring systems.',
    ],
  },
  {
    phaseNumber: 4,
    code: 'PHASE 04',
    title: 'Scale and Lead',
    timeframe: 'Years 3–5',
    statusLabel: 'Long-Term Strategic Horizon',
    summary:
      'Deepen national geographic reach, serve institutional buyers directly, and track measurable operational and agricultural impact metrics.',
    milestones: [
      'Expand geographically and deepen direct relationships with farms and institutional buyers.',
      'Evaluate additional product lines and partnerships based on compliance and market evidence.',
      'Track measurable outcomes such as customer retention, on-time delivery, product traceability, sales growth, and operational reliability.',
      'Review the strategy annually and update targets based on results and market conditions.',
    ],
  },
];
