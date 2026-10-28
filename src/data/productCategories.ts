import { ProductCategory } from '@/types';

export const PRODUCT_PORTFOLIO_DISCLAIMER =
  'Display Notice: The product categories and items listed in this catalogue represent category examples from the Lijemrakel Trading PLC portfolio brief. They do not constitute confirmation that every item is currently imported, registered, or in stock. Individual products are supplied strictly upon verification of Ethiopian regulatory registration/authorization, approved label indications, pack size, storage conditions, and local availability.';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: 'veterinary-medicines',
    name: 'Veterinary Medicines',
    shortName: 'Veterinary Medicines',
    code: 'CAT-A',
    tagline:
      'Essential Anthelmintics, Antibiotics, Antiprotozoals, and Nutritional Preparations for Livestock & Poultry Health',
    description:
      'Lijemrakel Trading PLC connects Ethiopian veterinary clinics, livestock producers, and poultry farms with quality-assured veterinary pharmaceuticals and nutritional supplements from qualified international manufacturers.',
    regulatoryGuidance:
      'All veterinary medicines are supplied and promoted strictly in line with applicable Ethiopian veterinary registration, prescription stewardship, species-specific directions, withdrawal periods, and approved product labeling. Medicines are clearly distinguished from nutritional feed supplements.',
    subcategories: [
      {
        name: 'Anthelmintics (dewormers)',
        examples: ['Albendazole', 'Fenbendazole', 'Ivermectin'],
        guidance:
          'Use the correct product label and species-specific directions approved for the market.',
      },
      {
        name: 'Antibiotics',
        examples: [
          'Oxytetracycline',
          'Penicillin–streptomycin combinations',
          'Amoxicillin',
        ],
        guidance:
          'These products are supplied and promoted only in line with applicable veterinary prescription, antimicrobial stewardship, and registration requirements.',
      },
      {
        name: 'Antiprotozoals',
        examples: ['Toltrazuril', 'Amprolium', 'Diminazene aceturate'],
        guidance:
          'Confirm target species, approved indications, withdrawal periods, and local regulatory authorization for each product.',
      },
      {
        name: 'Multivitamins and nutritional supplements',
        examples: [
          'Vitamin A-D3-E preparations',
          'B-complex vitamins',
          'Electrolyte and vitamin combinations',
        ],
        guidance:
          'Clearly distinguish veterinary medicines from nutritional supplements and follow approved label claims.',
      },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Illustrative veterinary pharmaceutical category visual — subject to specific registered manufacturer packaging.',
    keyRequirements: [
      'Verified Ethiopian veterinary registration and authorization status',
      'Approved species-specific dosing and administration instructions',
      'Explicit meat, milk, or egg withdrawal periods on every approved leaflet',
      'Clear separation between prescription therapeutics and nutritional supplements',
    ],
    coldChainSensitive: false,
  },
  {
    slug: 'vaccines',
    name: 'Veterinary Vaccines',
    shortName: 'Vaccines',
    code: 'CAT-B',
    tagline:
      'Preventive Immunization Solutions for Poultry and Livestock Under Strict Cold-Chain Stewardship',
    description:
      'Vaccines for relevant livestock and poultry diseases, sourced from reputable international biological manufacturers and managed under continuous temperature-controlled logistics.',
    regulatoryGuidance:
      'Supply is subject to national product registration, authorized target species and indications, strict cold-chain integrity (+2°C to +8°C or as specified), and local availability. Each product page displays storage and handling instructions derived directly from the approved manufacturer label.',
    heroImage:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Illustrative biological cold-chain and veterinary vaccine handling visual.',
    keyRequirements: [
      'Unbroken cold-chain storage and transport (+2°C to +8°C per approved label)',
      'Authorized target species and vaccination schedule compliance',
      'Batch-level traceability and veterinary import permit documentation',
      'Approved reconstitution and safe field-handling guidance',
    ],
    coldChainSensitive: true,
  },
  {
    slug: 'feed-premixes',
    name: 'Feed Premixes',
    shortName: 'Feed Premixes',
    code: 'CAT-C',
    tagline:
      'Balanced Vitamin-Mineral and Nutritional Premixes for Productive Poultry and Livestock Rations',
    description:
      'High-grade poultry and livestock vitamin-mineral premixes and approved nutritional formulations engineered to support feed conversion, skeletal integrity, egg production, and herd immunity.',
    regulatoryGuidance:
      'Product specifications state intended target species, recommended inclusion rates per metric ton of feed, guaranteed vitamin/mineral composition, packaging formats, and manufacturer identity as provided in official specification sheets.',
    heroImage:
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Illustrative livestock and poultry nutrition category visual.',
    keyRequirements: [
      'Guaranteed vitamin, trace mineral, and amino-acid composition certificates',
      'Clear inclusion rate guidelines (e.g., 0.25% – 2.5% per ration type)',
      'Moisture-resistant, UV-protected multi-wall industrial packaging',
      'Distinct labeling as nutritional premix (non-therapeutic)',
    ],
    coldChainSensitive: false,
  },
  {
    slug: 'hormones',
    name: 'Hormones and Related Products',
    shortName: 'Hormones',
    code: 'CAT-D',
    tagline:
      'Authorized Veterinary Reproductive and Herd-Management Solutions Under Professional Supervision',
    description:
      'Veterinary hormonal preparations for authorized reproductive management, estrus synchronization, and clinical herd-health protocols in commercial dairy and livestock operations.',
    regulatoryGuidance:
      'Supplied strictly for authorized reproductive or herd-management applications only where registered and legally permitted in Ethiopia. Product pages and technical communications never imply unapproved uses, and administration is restricted to licensed veterinary professionals.',
    heroImage:
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Illustrative dairy and herd reproductive management category visual.',
    keyRequirements: [
      'Restricted to legally permitted and registered veterinary indications',
      'Mandatory administration or supervision by licensed veterinarians',
      'Strict adherence to withdrawal periods and storage temperature limits',
      'Zero promotion of unapproved or off-label growth uses',
    ],
    coldChainSensitive: true,
  },
  {
    slug: 'fertilized-eggs',
    name: 'Fertilized Eggs',
    shortName: 'Fertilized Eggs',
    code: 'CAT-E',
    tagline:
      'Certified Hatching Eggs for Commercial Poultry Production & Hatcheries',
    description:
      'High-hatchability fertilized eggs sourced from disease-free, certified international parent-stock breeder flocks to supply Ethiopian hatcheries and commercial poultry producers.',
    regulatoryGuidance:
      'Importation and distribution of fertilized/hatching eggs are governed by comprehensive supplier flock health documentation, Ethiopian veterinary import permits, official veterinary health certification, strict biosecurity, and climate-controlled air/road transport conditions.',
    heroImage:
      'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Illustrative certified hatching eggs and biosecure poultry supply visual.',
    keyRequirements: [
      'Official veterinary health certificate and parent-flock vaccination records',
      'Import permit compliance and point-of-entry biosecurity inspection',
      'Controlled holding temperature (typically 15°C – 18°C) and relative humidity (75% – 80%)',
      'Sanitized, shock-protected export hatching-egg trays and cartons',
    ],
    coldChainSensitive: true,
  },
];

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((cat) => cat.slug === slug);
}
