export type VerificationStatus =
  | 'category-example-pending-verification'
  | 'registered-verified'
  | 'planned-development';

export type ProductCategorySlug =
  | 'veterinary-medicines'
  | 'vaccines'
  | 'feed-premixes'
  | 'hormones'
  | 'fertilized-eggs';

export type VetMedSubcategory =
  | 'Anthelmintics (dewormers)'
  | 'Antibiotics'
  | 'Antiprotozoals'
  | 'Multivitamins and nutritional supplements';

export type ProductClassification =
  | 'Veterinary Medicine'
  | 'Nutritional / Feed Supplement'
  | 'Biological / Vaccine'
  | 'Reproductive / Herd-Management Hormone'
  | 'Certified Hatching Input';

export interface ProductCategory {
  slug: ProductCategorySlug;
  name: string;
  shortName: string;
  code: string;
  tagline: string;
  description: string;
  regulatoryGuidance: string;
  subcategories?: {
    name: VetMedSubcategory;
    examples: string[];
    guidance: string;
  }[];
  heroImage: string;
  imageCaption: string;
  keyRequirements: string[];
  coldChainSensitive: boolean;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  categorySlug: ProductCategorySlug;
  categoryName: string;
  subcategory?: VetMedSubcategory;
  classification: ProductClassification;
  activeIngredientOrComposition: string;
  dosageForm: string;
  packSize: string;
  intendedSpecies: string[];
  approvedIndicationsSummary: string;
  storageConditions: string;
  coldChainRequired: boolean;
  withdrawalPeriodNote: string;
  manufacturerStatus: string;
  authorizationStatusNote: string;
  stewardshipWarning: string;
  verificationStatus: VerificationStatus;
  image: string;
  imageCaption: string;
  featured?: boolean;
}

export interface CoreValue {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ExecutiveMember {
  id: string;
  name: string;
  formalTitlePrefix?: string;
  displayName: string;
  initials: string;
  roleTitle: string;
  department: string;
  isFoundingMember: boolean;
  isProposedBoardMember: boolean;
  isManagementTeam: boolean;
  summary: string;
  responsibilities: string[];
  portraitUrl?: string;
  portraitNote: string;
}

export interface StrategyPhase {
  phaseNumber: number;
  code: string;
  title: string;
  timeframe: string;
  summary: string;
  milestones: string[];
  statusLabel: string;
}

export interface BusinessAreaCardItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  status: 'Active Trading Focus' | 'Planned Development (Phase 3)';
  iconName: string;
  examples: string[];
}
