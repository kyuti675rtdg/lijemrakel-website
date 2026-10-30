import {
  MediaAssetItem,
  ProductCategoryRecord,
  SeoPageConfig,
} from '@/types/admin';

/**
 * Geographic SVG map coordinates (1000 x 500 equirectangular viewBox)
 * Used to plot real recorded visitor country codes on the Global Visitor Map.
 */
export const COUNTRY_GEO_REGISTRY: Record<
  string,
  { countryName: string; region: string; coordinates: { x: number; y: number } }
> = {
  ET: {
    countryName: 'Ethiopia',
    region: 'East Africa',
    coordinates: { x: 604, y: 274 },
  },
  US: {
    countryName: 'United States',
    region: 'North America',
    coordinates: { x: 215, y: 175 },
  },
  DE: {
    countryName: 'Germany',
    region: 'Central Europe',
    coordinates: { x: 522, y: 142 },
  },
  GB: {
    countryName: 'United Kingdom',
    region: 'Western Europe',
    coordinates: { x: 486, y: 132 },
  },
  CA: {
    countryName: 'Canada',
    region: 'North America',
    coordinates: { x: 210, y: 112 },
  },
  IN: {
    countryName: 'India',
    region: 'South Asia',
    coordinates: { x: 712, y: 238 },
  },
  NL: {
    countryName: 'Netherlands',
    region: 'Western Europe',
    coordinates: { x: 508, y: 136 },
  },
  KE: {
    countryName: 'Kenya',
    region: 'East Africa',
    coordinates: { x: 602, y: 304 },
  },
  AE: {
    countryName: 'United Arab Emirates',
    region: 'Middle East',
    coordinates: { x: 648, y: 230 },
  },
  CN: {
    countryName: 'China',
    region: 'East Asia',
    coordinates: { x: 785, y: 192 },
  },
  FR: {
    countryName: 'France',
    region: 'Western Europe',
    coordinates: { x: 502, y: 156 },
  },
  IT: {
    countryName: 'Italy',
    region: 'Southern Europe',
    coordinates: { x: 530, y: 168 },
  },
  TR: {
    countryName: 'Turkey',
    region: 'Eurasia',
    coordinates: { x: 586, y: 180 },
  },
  SA: {
    countryName: 'Saudi Arabia',
    region: 'Middle East',
    coordinates: { x: 622, y: 228 },
  },
  EG: {
    countryName: 'Egypt',
    region: 'North Africa',
    coordinates: { x: 576, y: 214 },
  },
  ZA: {
    countryName: 'South Africa',
    region: 'Southern Africa',
    coordinates: { x: 562, y: 396 },
  },
  NG: {
    countryName: 'Nigeria',
    region: 'West Africa',
    coordinates: { x: 518, y: 276 },
  },
  DJ: {
    countryName: 'Djibouti',
    region: 'East Africa',
    coordinates: { x: 616, y: 266 },
  },
  SD: {
    countryName: 'Sudan',
    region: 'East Africa',
    coordinates: { x: 580, y: 252 },
  },
  BE: {
    countryName: 'Belgium',
    region: 'Western Europe',
    coordinates: { x: 506, y: 144 },
  },
  ES: {
    countryName: 'Spain',
    region: 'Southern Europe',
    coordinates: { x: 484, y: 174 },
  },
  CH: {
    countryName: 'Switzerland',
    region: 'Central Europe',
    coordinates: { x: 516, y: 154 },
  },
  SE: {
    countryName: 'Sweden',
    region: 'Northern Europe',
    coordinates: { x: 536, y: 102 },
  },
  NO: {
    countryName: 'Norway',
    region: 'Northern Europe',
    coordinates: { x: 518, y: 98 },
  },
  BR: {
    countryName: 'Brazil',
    region: 'South America',
    coordinates: { x: 326, y: 336 },
  },
  AR: {
    countryName: 'Argentina',
    region: 'South America',
    coordinates: { x: 302, y: 408 },
  },
  MX: {
    countryName: 'Mexico',
    region: 'North America',
    coordinates: { x: 196, y: 224 },
  },
  JP: {
    countryName: 'Japan',
    region: 'East Asia',
    coordinates: { x: 878, y: 182 },
  },
  KR: {
    countryName: 'South Korea',
    region: 'East Asia',
    coordinates: { x: 846, y: 184 },
  },
  SG: {
    countryName: 'Singapore',
    region: 'Southeast Asia',
    coordinates: { x: 782, y: 294 },
  },
  AU: {
    countryName: 'Australia',
    region: 'Oceania',
    coordinates: { x: 836, y: 374 },
  },
  RU: {
    countryName: 'Russia',
    region: 'Eurasia',
    coordinates: { x: 685, y: 106 },
  },
  UG: {
    countryName: 'Uganda',
    region: 'East Africa',
    coordinates: { x: 588, y: 298 },
  },
  TZ: {
    countryName: 'Tanzania',
    region: 'East Africa',
    coordinates: { x: 596, y: 322 },
  },
  GH: {
    countryName: 'Ghana',
    region: 'West Africa',
    coordinates: { x: 496, y: 278 },
  },
  MA: {
    countryName: 'Morocco',
    region: 'North Africa',
    coordinates: { x: 478, y: 202 },
  },
};

export const INITIAL_PRODUCT_CATEGORIES: ProductCategoryRecord[] = [
  {
    id: 'CAT-01',
    slug: 'veterinary-medicines',
    name: 'Veterinary Medicines',
    description:
      'Anthelmintics, antibiotics, antiprotozoals, and vitamin supplements supplied in line with national veterinary registration standards.',
    subcategories: [
      'Anthelmintics (dewormers)',
      'Antibiotics (injectable and oral)',
      'Antiprotozoals',
      'Vitamins and supplements',
    ],
    status: 'Active',
    createdAt: '2026-10-20',
  },
  {
    id: 'CAT-02',
    slug: 'vaccines',
    name: 'Veterinary Vaccines',
    description:
      'Preventive poultry and livestock vaccines handled under strict +2°C to +8°C cold-chain protection.',
    subcategories: ['Poultry Vaccines', 'Livestock Vaccines'],
    status: 'Active',
    createdAt: '2026-10-20',
  },
  {
    id: 'CAT-03',
    slug: 'feed-premixes',
    name: 'Feed Premixes',
    description:
      'Balanced vitamin, trace-mineral, and amino-acid nutrition premixes for broiler, layer, breeder, and ruminant rations.',
    subcategories: ['Poultry Premixes', 'Ruminant & Livestock Premixes'],
    status: 'Active',
    createdAt: '2026-10-20',
  },
  {
    id: 'CAT-04',
    slug: 'hormones',
    name: 'Veterinary Hormones',
    description:
      'Prescription veterinary reproductive hormones for licensed veterinary use in dairy and breeding herds.',
    subcategories: ['Reproductive Management Hormones'],
    status: 'Active',
    createdAt: '2026-10-20',
  },
  {
    id: 'CAT-05',
    slug: 'fertilized-eggs',
    name: 'Fertilized Hatching Eggs',
    description:
      'Certified parent-stock fertilized hatching eggs from disease-free breeder flocks with full veterinary health certificates.',
    subcategories: ['Broiler & Layer Hatching Eggs'],
    status: 'Active',
    createdAt: '2026-10-20',
  },
];

export const INITIAL_MEDIA_LIBRARY: MediaAssetItem[] = [
  {
    id: 'MEDIA-01',
    title: 'Official Lijemrakel Trading PLC Emblem Logo',
    fileName: 'lijemrakel-logo.png',
    url: '/images/logo/lijemrakel-logo.png',
    category: 'Logo & Brand',
    fileType: 'PNG',
    dimensions: '800 × 600 px',
    uploadedAt: '2026-10-20',
    altText: 'Lijemrakel Trading PLC official corporate logo',
  },
  {
    id: 'MEDIA-02',
    title: 'Hero Executive Handshake (Uncompressed HQ)',
    fileName: 'lijemrakel-hero-handshake-hq.jpg',
    url: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
    category: 'Hero & Office',
    fileType: 'JPEG (HQ)',
    dimensions: '1920 × 1005 px',
    uploadedAt: '2026-10-28',
    altText: 'Lijemrakel Trading PLC leadership partnership handshake in front of wall emblem',
  },
  {
    id: 'MEDIA-03',
    title: 'Executive Office Desk Portrait — Mr Lijalem Abayneh',
    fileName: 'lijemrakel-about-final.jpg',
    url: '/images/hero/lijemrakel-about-final.jpg',
    category: 'Hero & Office',
    fileType: 'JPEG',
    dimensions: '1280 × 580 px',
    uploadedAt: '2026-10-27',
    altText: 'Lijemrakel Trading PLC executive office desk in Addis Ababa',
  },
  {
    id: 'MEDIA-04',
    title: 'Phase 1 Strategy — Addis Ababa Executive Boardroom',
    fileName: 'phase-1.jpg',
    url: '/images/strategy/phase-1.jpg',
    category: 'Strategy',
    fileType: 'JPEG',
    dimensions: '1400 × 788 px',
    uploadedAt: '2026-10-27',
    altText: 'Phase 1 Foundation and Market Entry',
  },
  {
    id: 'MEDIA-05',
    title: 'Phase 2 Strategy — Cold-Chain & Quality Warehousing',
    fileName: 'phase-2.jpg',
    url: '/images/strategy/phase-2.jpg',
    category: 'Strategy',
    fileType: 'JPEG',
    dimensions: '1400 × 788 px',
    uploadedAt: '2026-10-27',
    altText: 'Phase 2 Market Expansion and Portfolio Growth',
  },
  {
    id: 'MEDIA-06',
    title: 'Phase 3 Strategy — Modern Hatchery & Egg Incubation',
    fileName: 'phase-3.jpg',
    url: '/images/strategy/phase-3.jpg',
    category: 'Strategy',
    fileType: 'JPEG',
    dimensions: '1400 × 788 px',
    uploadedAt: '2026-10-27',
    altText: 'Phase 3 Poultry and Hatchery Development',
  },
  {
    id: 'MEDIA-07',
    title: 'Phase 4 Strategy — National Scale & Export Readiness',
    fileName: 'phase-4.jpg',
    url: '/images/strategy/phase-4.jpg',
    category: 'Strategy',
    fileType: 'JPEG',
    dimensions: '1400 × 788 px',
    uploadedAt: '2026-10-27',
    altText: 'Phase 4 Consolidation, Scale, and Export Readiness',
  },
  {
    id: 'MEDIA-08',
    title: 'Mr Lijalem Abayneh — Chief Executive Officer (CEO) Portrait',
    fileName: '1793297131637-photo_2026-04-06_04-12-56.jpg',
    url: '/uploads/1793297131637-photo_2026-04-06_04-12-56.jpg',
    category: 'Leadership',
    fileType: 'JPEG',
    dimensions: '800 × 800 px',
    uploadedAt: '2026-10-28',
    altText: 'Mr Lijalem Abayneh — Founding Member & Chief Executive Officer (CEO)',
  },
  {
    id: 'MEDIA-09',
    title: 'Dr Etsubdink Negash — General & Technical Manager Portrait',
    fileName: '1793297343211-photo_2026-04-06_04-14-35.jpg',
    url: '/uploads/1793297343211-photo_2026-04-06_04-14-35.jpg',
    category: 'Leadership',
    fileType: 'JPEG',
    dimensions: '800 × 800 px',
    uploadedAt: '2026-10-28',
    altText: 'Dr Etsubdink Negash — Founding Member & General and Technical Manager',
  },
];

export const INITIAL_SEO_CONFIGS: SeoPageConfig[] = [
  {
    id: 'SEO-HOME',
    route: '/',
    pageName: 'Homepage',
    metaTitle: 'Lijemrakel Trading PLC | Veterinary, Poultry & Agricultural Import-Export Solutions',
    metaDescription:
      'Supporting Ethiopia’s Agriculture Through Reliable Veterinary and Poultry Solutions. Importing veterinary medicines, vaccines, feed premixes, hormones, and fertilized eggs.',
    canonicalUrl: 'https://lijemrakel.com/',
    keywords:
      'Lijemrakel Trading PLC, Veterinary Medicines Ethiopia, Veterinary Vaccines Ethiopia, Feed Premixes, Fertilized Hatching Eggs',
    ogTitle: 'Lijemrakel Trading PLC | Veterinary & Poultry Solutions',
    ogDescription:
      'Supporting Ethiopia’s Agriculture Through Reliable Veterinary and Poultry Solutions.',
    ogImage: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
    indexStatus: 'index, follow',
    lastUpdated: '2026-10-28',
  },
  {
    id: 'SEO-ABOUT',
    route: '/about',
    pageName: 'About Us — Company Overview',
    metaTitle: 'About Lijemrakel Trading PLC | Ethiopian Veterinary & Agricultural Trade',
    metaDescription:
      'Learn about Lijemrakel Trading PLC, connecting reputable international manufacturers with veterinary professionals, livestock producers, and poultry farms across Ethiopia.',
    canonicalUrl: 'https://lijemrakel.com/about',
    keywords: 'About Lijemrakel Trading, Ethiopian Veterinary Importer, Gebeta Le Hager Agriculture',
    ogTitle: 'About Lijemrakel Trading PLC',
    ogDescription:
      'Connecting reputable international manufacturers with veterinary professionals and farms across Ethiopia.',
    ogImage: '/images/hero/lijemrakel-about-final.jpg',
    indexStatus: 'index, follow',
    lastUpdated: '2026-10-28',
  },
  {
    id: 'SEO-STRATEGY',
    route: '/about/strategy',
    pageName: 'Our Strategy — 5-Year Roadmap',
    metaTitle: 'Our Strategy — 5-Year Strategic Direction | Lijemrakel Trading PLC',
    metaDescription:
      'Explore Lijemrakel Trading PLC’s 4-phase, 5-year strategic roadmap from veterinary market entry to domestic poultry production and hatchery development.',
    canonicalUrl: 'https://lijemrakel.com/about/strategy',
    keywords: 'Lijemrakel Strategy, Poultry Hatchery Roadmap Ethiopia, Veterinary Distribution Plan',
    ogTitle: 'Our Strategy — 5-Year Roadmap | Lijemrakel Trading PLC',
    ogDescription:
      '4-phase strategic roadmap from veterinary market entry to domestic poultry production and hatchery development.',
    ogImage: '/images/strategy/phase-1.jpg',
    indexStatus: 'index, follow',
    lastUpdated: '2026-10-28',
  },
  {
    id: 'SEO-LEADERSHIP',
    route: '/about/leadership',
    pageName: 'Leadership & Governance',
    metaTitle: 'Leadership — Founders, Board & Executive Management | Lijemrakel Trading PLC',
    metaDescription:
      'Meet the Founding Members, Board of Directors, and Executive Management Team guiding Lijemrakel Trading PLC.',
    canonicalUrl: 'https://lijemrakel.com/about/leadership',
    keywords: 'Lijalem Abayneh, Dr Etsubdink Negash, Abel Girma, Yelekal Kebede, Desalegn Tamene',
    ogTitle: 'Leadership & Governance | Lijemrakel Trading PLC',
    ogDescription:
      'Meet the Founding Members, Board of Directors, and Executive Management Team guiding Lijemrakel Trading PLC.',
    ogImage: '/uploads/1793297131637-photo_2026-04-06_04-12-56.jpg',
    indexStatus: 'index, follow',
    lastUpdated: '2026-10-28',
  },
  {
    id: 'SEO-PRODUCTS',
    route: '/products',
    pageName: 'Products & Divisions Catalogue',
    metaTitle: 'Product Catalogue — Veterinary Medicines, Vaccines, Premixes & Hatching Eggs',
    metaDescription:
      'Browse Lijemrakel Trading PLC’s veterinary medicines, vaccines, feed premixes, reproductive hormones, and certified fertilized hatching eggs.',
    canonicalUrl: 'https://lijemrakel.com/products',
    keywords: 'Albendazole Ethiopia, Ivermectin, Oxytetracycline, Poultry Vaccines, Broiler Premix',
    ogTitle: 'Veterinary & Poultry Product Catalogue | Lijemrakel Trading PLC',
    ogDescription:
      'Browse Lijemrakel Trading PLC’s veterinary medicines, vaccines, feed premixes, reproductive hormones, and certified fertilized hatching eggs.',
    ogImage: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
    indexStatus: 'index, follow',
    lastUpdated: '2026-10-28',
  },
  {
    id: 'SEO-CONTACT',
    route: '/contact',
    pageName: 'Contact Us',
    metaTitle: 'Contact Lijemrakel Trading PLC | Debrewerk Tower, Mexico, Addis Ababa',
    metaDescription:
      'Contact Lijemrakel Trading PLC at Debrewerk Tower | Mexico, Addis Ababa or call 0913514767 for veterinary product inquiries and supplier partnerships.',
    canonicalUrl: 'https://lijemrakel.com/contact',
    keywords: 'Contact Lijemrakel Trading, Debrewerk Tower Mexico Addis Ababa, 0913514767',
    ogTitle: 'Contact Lijemrakel Trading PLC',
    ogDescription:
      'Contact Lijemrakel Trading PLC at Debrewerk Tower | Mexico, Addis Ababa or call 0913514767.',
    ogImage: '/images/hero/lijemrakel-hero-handshake-hq.jpg',
    indexStatus: 'index, follow',
    lastUpdated: '2026-10-28',
  },
];
