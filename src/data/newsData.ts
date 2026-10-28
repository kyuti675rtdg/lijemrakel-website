export type NewsCategorySlug =
  | 'company-news'
  | 'announcements'
  | 'business-updates';

export interface NewsArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  categorySlug: NewsCategorySlug;
  categoryLabel: 'Company News' | 'Announcements' | 'Business Updates';
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  keyTakeaways: string[];
  sections: NewsArticleSection[];
  quote: {
    text: string;
    attribution: string;
  };
  tags: string[];
  featured?: boolean;
}

export const NEWS_CATEGORIES: {
  slug: NewsCategorySlug | 'all';
  label: string;
}[] = [
  { slug: 'all', label: 'All Updates' },
  { slug: 'company-news', label: 'Company News' },
  { slug: 'announcements', label: 'Announcements' },
  { slug: 'business-updates', label: 'Business Updates' },
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-01',
    slug: 'lijemrakel-strengthens-international-veterinary-sourcing',
    title:
      'Lijemrakel Trading PLC Strengthens International Sourcing for Veterinary Medicines & Vaccines',
    categorySlug: 'company-news',
    categoryLabel: 'Company News',
    date: 'October 2026',
    readTime: '4 min read',
    excerpt:
      'Expanding supplier partnerships with certified international manufacturers to ensure reliable veterinary pharmaceutical and biological supply across Ethiopia.',
    image: '/images/hero/lijemrakel-hero-handshake.jpg',
    featured: true,
    author: {
      name: 'Dr Etsubdink Negash',
      role: 'General & Technical Manager',
      avatar: '/images/leadership/leader-etsubdink.jpg',
    },
    keyTakeaways: [
      'Direct sourcing partnerships with GMP-certified international veterinary manufacturers.',
      'Strict regulatory registration and technical dossier verification before importation.',
      'Dedicated cold-chain logistics for temperature-sensitive poultry and livestock vaccines.',
    ],
    sections: [
      {
        heading: 'Advancing Reliable Veterinary Supply in Ethiopia',
        paragraphs: [
          'Lijemrakel Trading PLC continues to expand its international supplier network to ensure that veterinary professionals, livestock producers, and commercial poultry farms across Ethiopia have consistent access to essential animal health products.',
          'Our portfolio spans four core therapeutic classes of veterinary medicines—anthelmintics, antibiotics, antiprotozoals, and multivitamin supplements—alongside preventive vaccines, feed premixes, reproductive hormones, and certified fertilized hatching eggs.',
        ],
      },
      {
        heading: 'Technical Evaluation & Regulatory Stewardship',
        paragraphs: [
          'Every supplier partnership begins with rigorous technical evaluation led by our veterinary and regulatory team. We review manufacturer certifications, active ingredient specifications, stability data, and approved product labeling to ensure full compliance with Ethiopian veterinary authority requirements.',
          'By combining technical oversight with disciplined import logistics, we help safeguard livestock health, farm productivity, and food safety across the agricultural value chain.',
        ],
      },
    ],
    quote: {
      text: 'Our priority is connecting dependable international veterinary manufacturers with Ethiopia’s farming community through responsible sourcing, technical competence, and strict quality assurance.',
      attribution: 'Dr Etsubdink Negash — General & Technical Manager',
    },
    tags: ['Veterinary Medicines', 'Vaccines', 'Global Sourcing', 'Ethiopia'],
  },
  {
    id: 'news-02',
    slug: 'poultry-nutrition-feed-premix-portfolio-expansion',
    title:
      'Expanding Poultry & Dairy Feed Premix Supply Across Bishoftu, Adama, and Regional Ethiopian Farm Corridors',
    categorySlug: 'business-updates',
    categoryLabel: 'Business Updates',
    date: 'October 2026',
    readTime: '4 min read',
    excerpt:
      'Delivering balanced vitamin, trace-mineral, and amino acid premix formulations to commercial feed mills, poultry clusters in Bishoftu and Mojo, and dairy cooperatives across Ethiopia.',
    image: '/images/strategy/phase-1.jpg',
    featured: true,
    author: {
      name: 'Mr Lijalem Abayneh',
      role: 'Deputy General Manager',
      avatar: '/images/leadership/leader-lijalem.jpg',
    },
    keyTakeaways: [
      'Tailored 1% to 2.5% vitamin-mineral premixes for Ethiopian commercial feed mills in Bishoftu, Adama, Mojo, and Addis Ababa.',
      'Specialized dairy cattle mineral formulations calibrated to address highland forage micronutrient gaps in Oromia, Amhara, and Central Ethiopia.',
      'Full Certificate of Analysis (CoA) and Amharic/English mixing guidance provided with every consignment.',
    ],
    sections: [
      {
        heading: 'Supporting Ethiopia’s High-Growth Poultry & Feed Mill Clusters',
        paragraphs: [
          'Commercial poultry and livestock producers across the Bishoftu (Debre Zeit), Mojo, Adama, and Addis Ababa agricultural belt rely on consistent micronutrient balance to maximize egg laying persistence, broiler weight gain, and feed conversion efficiency using local maize and oilseed cake rations.',
          'From our headquarters in Bole Sub-City, Addis Ababa, Lijemrakel Trading PLC supplies high-stability vitamin, trace-mineral, and essential amino acid premixes engineered to complement Ethiopian feed raw materials and prevent nutritional deficiencies.',
        ],
      },
      {
        heading: 'Advancing Highland Dairy & Beef Cattle Productivity Under Yelemat Tirufat',
        paragraphs: [
          'In direct support of Ethiopia’s national Yelemat Tirufat dairy and poultry productivity program, our ruminant premix line provides bioavailable calcium, phosphorus, selenium, zinc, and vitamins A, D3, and E for peri-urban dairy farms in Sululta, Sebeta, Holeta, Bahir Dar, and Hawassa—strengthening herd fertility, milk yield, and calf immunity.',
        ],
      },
    ],
    quote: {
      text: 'By matching international premix formulations to Ethiopian feed raw materials in Bishoftu, Adama, and regional farm corridors, we help local feed mills and farmers achieve stronger flocks and higher yields.',
      attribution: 'Mr Lijalem Abayneh — Deputy General Manager',
    },
    tags: ['Ethiopia Agriculture', 'Bishoftu Poultry', 'Feed Premixes', 'Yelemat Tirufat'],
  },
  {
    id: 'news-03',
    slug: 'strategic-roadmap-poultry-and-hatchery-development',
    title:
      'Ethiopian Poultry & Hatchery Roadmap: Advancing Domestic Day-Old Chick Capacity for Local Producers',
    categorySlug: 'announcements',
    categoryLabel: 'Announcements',
    date: 'September 2026',
    readTime: '4 min read',
    excerpt:
      'How Lijemrakel Trading PLC is bridging immediate fertilized hatching egg supply to Ethiopian hatcheries with Phase 3 domestic poultry breeding and incubation infrastructure.',
    image: '/images/strategy/phase-3.jpg',
    featured: true,
    author: {
      name: 'Dr Etsubdink Negash',
      role: 'General & Technical Manager',
      avatar: '/images/leadership/leader-etsubdink.jpg',
    },
    keyTakeaways: [
      'Consistent supply of high-fertility layer and broiler hatching eggs for commercial hatcheries across Ethiopia.',
      'Aligned with Ethiopia’s Gebeta Le Hager and Yelemat Tirufat national poultry self-reliance initiatives.',
      'Phase 3 roadmap establishes domestic climate-controlled incubation and veterinary-supervised day-old chick distribution.',
    ],
    sections: [
      {
        heading: 'Strengthening Ethiopia’s Domestic Poultry Value Chain',
        paragraphs: [
          'Ethiopia’s rapidly growing demand for table eggs and poultry meat requires a dependable supply of high-viability hatching eggs and disease-free day-old chicks. Lijemrakel Trading PLC currently partners with certified international parent-stock flocks to deliver sanitized, flock-certified fertilized hatching eggs directly to Ethiopian hatchery operators.',
          'Every shipment undergoes strict veterinary health certification and Ethiopian Agricultural Authority (EAA) import verification prior to arrival in Addis Ababa.',
        ],
      },
      {
        heading: 'Phase 3 Domestic Hatchery & Biosecurity Infrastructure in Ethiopia',
        paragraphs: [
          'Under Phase 3 of our corporate strategy, Lijemrakel Trading PLC is preparing feasibility and biosecurity frameworks for modern domestic hatchery and breeder operations in Ethiopia—featuring automated setter and hatcher cabinets, Marek’s and Newcastle hatchery vaccination protocols, and regional chick delivery across Oromia, Amhara, Sidama, and SNNP.',
        ],
      },
    ],
    quote: {
      text: 'Our goal in Ethiopia is to build a seamless bridge from certified hatching-egg importation today to modern domestic hatchery and day-old chick production tomorrow.',
      attribution: 'Dr Etsubdink Negash — General & Technical Manager',
    },
    tags: ['Ethiopian Hatcheries', 'Fertilized Eggs', 'Yelemat Tirufat', 'Gebeta Le Hager'],
  },
  {
    id: 'news-04',
    slug: 'cold-chain-stewardship-for-veterinary-biologicals',
    title:
      'From Bole Cargo Terminal to Regional Ethiopian Farms: Continuous Cold-Chain Logistics for Vaccines & Biologicals',
    categorySlug: 'business-updates',
    categoryLabel: 'Business Updates',
    date: 'September 2026',
    readTime: '3 min read',
    excerpt:
      'Maintaining unbroken +2°C to +8°C cold-chain integrity from Addis Ababa Bole International Airport customs clearance to veterinary clinics and poultry farms across Ethiopia.',
    image: '/images/strategy/phase-2.jpg',
    author: {
      name: 'Ato Desalegn Tamene',
      role: 'Operational Manager',
      avatar: '/images/leadership/leader-desalegn.jpg',
    },
    keyTakeaways: [
      'Rapid cold-storage clearance at Addis Ababa Bole Cargo Terminal into calibrated +2°C to +8°C cold rooms.',
      'Dedicated +15°C to +18°C climate-controlled handling and humidity protection for imported fertilized hatching eggs.',
      'Batch-level temperature data loggers accompanying regional dispatches to Bishoftu, Adama, Hawassa, Bahir Dar, and Mekelle.',
    ],
    sections: [
      {
        heading: 'Unbroken Cold-Chain Stewardship in Addis Ababa',
        paragraphs: [
          'Protecting the biological potency of Newcastle, Gumboro (IBD), Marek’s, Fowl Pox, and ruminant vaccines requires zero compromise during airfreight arrival and inland Ethiopian transit. Lijemrakel Trading PLC coordinates directly with Addis Ababa Bole International Airport cargo cold-chain facilities to transfer consignments immediately into monitored +2°C to +8°C cold rooms.',
          'Our veterinary operations team inspects digital temperature loggers upon arrival to verify that every vaccine vial and reproductive hormone batch remained within specification throughout transit.',
        ],
      },
      {
        heading: 'Safe Last-Mile Delivery to Ethiopian Clinics & Hatcheries',
        paragraphs: [
          'Using insulated transport systems and verified lot tracking, we distribute temperature-sensitive biologicals and fertilized hatching eggs to commercial poultry farms, dairy cooperatives, and regional veterinary pharmacies across Ethiopia with full batch traceability.',
        ],
      },
    ],
    quote: {
      text: 'From the moment a consignment lands at Bole Cargo Terminal in Addis Ababa until it reaches a farm in Bishoftu or Hawassa, our cold-chain discipline protects every dose and every egg.',
      attribution: 'Ato Desalegn Tamene — Operational Manager',
    },
    tags: ['Bole Cargo Cold-Chain', 'Addis Ababa Logistics', 'Veterinary Vaccines', 'Ethiopia'],
  },
  {
    id: 'news-05',
    slug: 'b2b-supplier-and-distributor-partnership-desk',
    title:
      'Bole Sub-City Headquarters Opens Dedicated B2B Desk for Ethiopian Veterinary Clinics, Unions & Commercial Farms',
    categorySlug: 'announcements',
    categoryLabel: 'Announcements',
    date: 'August 2026',
    readTime: '3 min read',
    excerpt:
      'Connecting regional livestock cooperatives, private veterinary pharmacies, and commercial poultry enterprises directly with our technical and commercial desk in Addis Ababa.',
    image: '/images/strategy/phase-4.jpg',
    author: {
      name: 'Ato Yelekal Kebede',
      role: 'International Business Manager',
      avatar: '/images/leadership/leader-yelekal.jpg',
    },
    keyTakeaways: [
      'Walk-in and digital B2B consultation desk at Bole Sub-City, Woreda 13, Asamenewuel Building, Addis Ababa.',
      'Direct wholesale supply coordination for Ethiopian veterinary clinics, agricultural unions, and commercial farms.',
      'Regulatory registration and national agency representation for GMP-certified global manufacturers entering Ethiopia.',
    ],
    sections: [
      {
        heading: 'Serving Ethiopian Livestock Unions, Clinics & Commercial Producers',
        paragraphs: [
          'Located in Bole Sub-City, Woreda 13 (Asamenewuel Building, 3rd Floor, Office No. 305) in Addis Ababa, Lijemrakel Trading PLC’s B2B Commercial & Technical Desk streamlines wholesale procurement for Ethiopian veterinary clinics, regional drug shops, poultry enterprises, and dairy unions.',
          'Buyers across Addis Ababa, Oromia, Amhara, Sidama, South West Ethiopia, and Tigray can request product dossiers, veterinary prescription guidance, pack-size availability, and scheduled supply contracts across all five import categories.',
        ],
      },
      {
        heading: 'Trusted Ethiopian Market Representation for International Manufacturers',
        paragraphs: [
          'Our International Business division works closely with global veterinary pharmaceutical, vaccine, premix, and parent-stock breeding companies to manage Ethiopian Agricultural Authority (EAA) dossier registration, import permits, and nationwide technical promotion.',
        ],
      },
    ],
    quote: {
      text: 'Our Bole Sub-City coordination desk brings Ethiopian veterinary clinics, commercial farms, and international manufacturers together through transparent, responsive B2B service.',
      attribution: 'Ato Yelekal Kebede — International Business Manager',
    },
    tags: ['Bole Addis Ababa', 'Ethiopian Vet Clinics', 'B2B Distribution', 'EAA Compliance'],
  },
  {
    id: 'news-06',
    slug: 'supporting-ethiopias-agricultural-self-reliance',
    title:
      'Ethiopian Leadership & Founding Vision: Building Trusted Veterinary & Agricultural Trade from Addis Ababa',
    categorySlug: 'company-news',
    categoryLabel: 'Company News',
    date: 'August 2026',
    readTime: '3 min read',
    excerpt:
      'How Ethiopian founders Lijalem Abayneh, Dr Etsubdink Negash, and Abel Girma established Lijemrakel Trading PLC to advance livestock health and farm productivity nationwide.',
    image: '/images/hero/lijemrakel-about-final.jpg',
    author: {
      name: 'Ato Abel Girma',
      role: 'Financial Manager & Founding Member',
      avatar: '/images/leadership/leader-abel.jpg',
    },
    keyTakeaways: [
      'Founded and led in Addis Ababa by Ethiopian executives Lijalem Abayneh, Dr Etsubdink Negash, and Abel Girma.',
      'Combines Doctor of Veterinary Medicine (DVM) technical stewardship with disciplined Ethiopian import-export finance and logistics.',
      'Committed to long-term domestic agricultural impact across Ethiopia’s livestock, dairy, and poultry sectors.',
    ],
    sections: [
      {
        heading: 'An Ethiopian Enterprise Built on Veterinary Science & Trade Integrity',
        paragraphs: [
          'Headquartered in Addis Ababa, Lijemrakel Trading PLC was founded by Lijalem Abayneh, Dr Etsubdink Negash, and Abel Girma to address a critical need in Ethiopia’s agricultural economy: dependable, technically verified access to genuine veterinary medicines, vaccines, nutritional premixes, reproductive hormones, and fertilized hatching eggs.',
          'By uniting veterinary clinical oversight with structured international procurement and Ethiopian regulatory compliance, our leadership team ensures that local farmers and veterinary professionals receive authentic, high-efficacy inputs.',
        ],
      },
      {
        heading: 'Investing in Ethiopia’s Long-Term Agricultural Transformation',
        paragraphs: [
          'Beyond import distribution, Lijemrakel Trading PLC is committed to reinvesting in domestic Ethiopian agricultural capacity—supporting rural and peri-urban livestock livelihoods, strengthening food security, and preparing for future domestic poultry and export value addition.',
        ],
      },
    ],
    quote: {
      text: 'As an Ethiopian-founded company, every business decision we make is anchored in strengthening our country’s livestock health, poultry productivity, and agricultural self-reliance.',
      attribution: 'Ato Abel Girma — Financial Manager & Founding Member',
    },
    tags: ['Addis Ababa', 'Ethiopian Founders', 'Livestock Health', 'Lijemrakel Trading PLC'],
  },
];
