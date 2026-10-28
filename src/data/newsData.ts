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
      avatar:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
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
      'Supporting Farm Productivity Through Balanced Poultry & Livestock Feed Premixes',
    categorySlug: 'business-updates',
    categoryLabel: 'Business Updates',
    date: 'October 2026',
    readTime: '3 min read',
    excerpt:
      'Delivering essential vitamin, trace mineral, and amino acid premix formulations tailored for commercial layer, broiler, breeder, and dairy operations.',
    image:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85',
    featured: true,
    author: {
      name: 'Mr Lijalem Abayneh',
      role: 'Deputy General Manager',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    keyTakeaways: [
      'Stage-specific vitamin and trace-mineral premixes for broilers, layers, and breeders.',
      'Specialized ruminant nutritional premixes supporting dairy yield and herd fertility.',
      'Clear inclusion-rate documentation for commercial feed mills and integrated farms.',
    ],
    sections: [
      {
        heading: 'Precision Nutrition for Modern Farms',
        paragraphs: [
          'Consistent feed quality is one of the most decisive factors in commercial poultry and livestock performance. Lijemrakel Trading PLC supplies specialized vitamin-mineral premixes and essential amino acid concentrates formulated to optimize feed conversion, skeletal development, and egg production.',
          'Each premix consignment is accompanied by verified composition certificates and clear mixing instructions to support accurate inclusion at commercial feed mills and on-farm mixing units.',
        ],
      },
      {
        heading: 'Supporting Both Poultry & Ruminant Producers',
        paragraphs: [
          'Beyond poultry nutrition, our portfolio includes high-specification mineral and vitamin premixes for dairy and beef cattle—helping producers prevent micronutrient deficiencies, improve reproductive performance, and strengthen herd immunity.',
        ],
      },
    ],
    quote: {
      text: 'Reliable nutritional premixes empower Ethiopian feed mills and farms to achieve predictable growth rates, stronger flock immunity, and higher production efficiency.',
      attribution: 'Mr Lijalem Abayneh — Deputy General Manager',
    },
    tags: ['Feed Premixes', 'Poultry Nutrition', 'Livestock', 'Feed Mills'],
  },
  {
    id: 'news-03',
    slug: 'strategic-roadmap-poultry-and-hatchery-development',
    title:
      'Strategic Roadmap Update: Phase 3 Planning for Modern Poultry & Hatchery Operations',
    categorySlug: 'announcements',
    categoryLabel: 'Announcements',
    date: 'September 2026',
    readTime: '4 min read',
    excerpt:
      'Outlining our long-term strategic framework to transition from fertilized hatching egg supply into integrated domestic poultry production and hatchery development.',
    image:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85',
    featured: true,
    author: {
      name: 'Dr Etsubdink Negash',
      role: 'General & Technical Manager',
      avatar:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    },
    keyTakeaways: [
      'Structured four-phase growth roadmap spanning 0–12 months through Years 3–5.',
      'Active importation of certified fertilized hatching eggs supports immediate hatchery demand.',
      'Phase 3 (Years 2–3) focuses on feasibility, biosecurity design, and domestic hatchery development.',
    ],
    sections: [
      {
        heading: 'From Import Excellence to Domestic Value Creation',
        paragraphs: [
          'In alignment with national agricultural priorities including Gebeta Le Hager, Lijemrakel Trading PLC has designed a four-phase strategic roadmap that bridges immediate veterinary and poultry input supply with long-term domestic production.',
          'During Phases 1 and 2, our core focus remains establishing strong regulatory foundations, expanding supplier representation, and supplying veterinary medicines, vaccines, premixes, hormones, and fertilized hatching eggs across Ethiopia.',
        ],
      },
      {
        heading: 'Preparing for Phase 3 Poultry & Hatchery Operations',
        paragraphs: [
          'In Phase 3 (Years 2–3), the company plans to advance into modern poultry production and hatchery operations—incorporating automated incubation technology, strict biosecurity protocols, and veterinary-supervised day-old chick distribution.',
          'We welcome discussions with international parent-stock breeders, hatchery equipment providers, and agricultural development partners interested in collaborating on this long-term vision.',
        ],
      },
    ],
    quote: {
      text: 'Our four-phase roadmap ensures we build a rock-solid veterinary and hatching-egg supply chain today while preparing responsibly for domestic poultry and hatchery operations tomorrow.',
      attribution: 'Lijemrakel Trading PLC — Executive Leadership',
    },
    tags: ['Strategic Roadmap', 'Hatchery Development', 'Poultry Production', 'Gebeta Le Hager'],
  },
  {
    id: 'news-04',
    slug: 'cold-chain-stewardship-for-veterinary-biologicals',
    title:
      'Commitment to Cold-Chain Integrity Across Veterinary Vaccine & Egg Logistics',
    categorySlug: 'business-updates',
    categoryLabel: 'Business Updates',
    date: 'September 2026',
    readTime: '3 min read',
    excerpt:
      'Maintaining strict temperature monitoring and handling protocols from international port of entry to regional veterinary clinics and hatcheries.',
    image:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Ato Desalegn Tamene',
      role: 'Operational Manager',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    keyTakeaways: [
      'Continuous +2°C to +8°C cold-chain management for veterinary vaccines and hormones.',
      'Dedicated temperature and humidity control for imported fertilized hatching eggs.',
      'Full batch traceability from international dispatch to local customer delivery.',
    ],
    sections: [
      {
        heading: 'Protecting Biological Potency & Hatchability',
        paragraphs: [
          'Veterinary vaccines, reproductive hormones, and fertilized hatching eggs are highly sensitive to temperature fluctuations. Even brief deviations outside recommended storage ranges can compromise vaccine efficacy or embryo viability.',
          'At Lijemrakel Trading PLC, our Operations & Logistics division enforces strict cold-chain receiving, storage, and dispatch procedures across every temperature-controlled consignment.',
        ],
      },
      {
        heading: 'Traceability & Safe Regional Distribution',
        paragraphs: [
          'Each batch is logged with manufacturer lot numbers, expiration dates, and temperature records, ensuring veterinary clinics, livestock farms, and hatcheries receive products in optimal condition.',
        ],
      },
    ],
    quote: {
      text: 'Cold-chain discipline is essential to animal health—preserving the full potency of every vaccine vial and the hatchability of every fertilized egg we deliver.',
      attribution: 'Ato Desalegn Tamene — Operational Manager',
    },
    tags: ['Cold-Chain', 'Vaccines', 'Logistics', 'Quality Assurance'],
  },
  {
    id: 'news-05',
    slug: 'b2b-supplier-and-distributor-partnership-desk',
    title:
      'Official Announcement: Dedicated B2B Desk for Clinics, Farms & Global Suppliers',
    categorySlug: 'announcements',
    categoryLabel: 'Announcements',
    date: 'August 2026',
    readTime: '3 min read',
    excerpt:
      'Streamlining technical product inquiries, specification requests, and international manufacturer agency discussions through our corporate portal.',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Ato Yelekal Kebede',
      role: 'International Business Manager',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    },
    keyTakeaways: [
      'Direct routing for veterinary clinics, commercial farms, and regional distributors.',
      'Dedicated international supplier desk for GMP-certified manufacturers and breeders.',
      'Fast access to technical specifications across all five product categories.',
    ],
    sections: [
      {
        heading: 'Connecting International Manufacturers & Local Buyers',
        paragraphs: [
          'To serve both domestic agricultural buyers and international manufacturing partners efficiently, Lijemrakel Trading PLC operates a dedicated B2B coordination desk.',
          'Local veterinary clinics, poultry producers, livestock farms, and distributors can inquire directly about product specifications, pack sizes, and availability across our five core import categories.',
        ],
      },
      {
        heading: 'Long-Term Representation for Global Suppliers',
        paragraphs: [
          'International manufacturers of veterinary medicines, vaccines, premixes, hormones, and parent-stock hatching eggs can engage directly with our International Business and Technical teams regarding market registration and distribution representation in Ethiopia.',
        ],
      },
    ],
    quote: {
      text: 'Strong partnerships with both international manufacturers and local agricultural enterprises are the foundation of sustainable trade.',
      attribution: 'Ato Yelekal Kebede — International Business Manager',
    },
    tags: ['B2B Partnerships', 'International Trade', 'Distribution', 'Suppliers'],
  },
  {
    id: 'news-06',
    slug: 'supporting-ethiopias-agricultural-self-reliance',
    title:
      'Aligning Veterinary Trade With Ethiopia’s Agricultural Growth Priorities',
    categorySlug: 'company-news',
    categoryLabel: 'Company News',
    date: 'August 2026',
    readTime: '3 min read',
    excerpt:
      'How Lijemrakel Trading PLC combines veterinary technical leadership and international trade expertise to serve Ethiopian agriculture.',
    image:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Ato Abel Girma',
      role: 'Financial Manager & Founding Member',
      avatar:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    },
    keyTakeaways: [
      'Founded by Lijalem Abayneh, Dr Etsubdink Negash, and Abel Girma.',
      'Guided by seven core values including Quality, Integrity, and Agricultural Impact.',
      'Committed to supporting productive farms and Ethiopia’s broader agricultural economy.',
    ],
    sections: [
      {
        heading: 'A Shared Founding Vision for Ethiopian Agriculture',
        paragraphs: [
          'Founded by Lijalem Abayneh, Dr Etsubdink Negash, and Abel Girma, Lijemrakel Trading PLC was established with a clear purpose: to supply quality veterinary and poultry-sector products through reliable international sourcing and customer-focused distribution.',
          'Our governance and management structure brings together veterinary medicine, international business, logistics, and financial discipline under one roof.',
        ],
      },
      {
        heading: 'Creating Lasting Value Across the Supply Chain',
        paragraphs: [
          'By prioritizing product quality, transparent business practices, and long-term capability building, Lijemrakel Trading PLC aims to be a trusted contributor to Ethiopia’s livestock and poultry transformation.',
        ],
      },
    ],
    quote: {
      text: 'Sound financial governance, responsible sourcing, and veterinary expertise allow us to deliver lasting value to our customers and partners.',
      attribution: 'Ato Abel Girma — Financial Manager & Founding Member',
    },
    tags: ['Corporate Governance', 'Founding Vision', 'Agricultural Economy'],
  },
];
