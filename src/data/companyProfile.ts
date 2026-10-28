import { BusinessAreaCardItem, CoreValue } from '@/types';

export const COMPANY_PROFILE = {
  legalName: 'Lijemrakel Trading PLC',
  shortName: 'Lijemrakel Trading',
  logoDescriptor: 'IMPORT & EXPORT | BUSINESS | LOGISTICS | INTERNATIONAL TRADE',
  primaryBusiness:
    'Import and export, with a focus on veterinary and livestock-sector products',
  growthAreas:
    'Poultry production, hatchery operations, and wider agricultural supply',
  foundingMembersList: [
    'Lijalem Abayneh',
    'Dr Etsubdink Negash',
    'Abel Girma',
  ],
  hero: {
    eyebrow: 'VETERINARY, LIVESTOCK & POULTRY SOLUTIONS',
    headline:
      'Supporting Ethiopia’s Agriculture Through Reliable Veterinary and Poultry Solutions',
    supportingLine:
      'Importing essential veterinary and poultry-sector products while building long-term capabilities in livestock health, poultry production, and hatchery development.',
    primaryCta: {
      label: 'Explore Products',
      href: '/products',
    },
    secondaryCta: {
      label: 'Contact Us',
      href: '/contact',
    },
  },
  whoWeAre: {
    paragraph1:
      'Lijemrakel Trading PLC is an import and export company primarily focused on the veterinary and agricultural sectors. The company aims to connect the Ethiopian market with dependable international manufacturers and suppliers of veterinary medicines, vaccines, feed premixes, hormones, and fertilized eggs. Building on technical knowledge, international business relationships, and a commitment to responsible supply, the company seeks to become a trusted supplier for veterinary professionals, livestock producers, poultry farms, hatcheries, and agricultural businesses.',
    paragraph2:
      'The company’s long-term direction also includes poultry production and hatchery business development. Through these activities, Lijemrakel Trading PLC aims to contribute to a stronger agricultural value chain, support livestock and poultry productivity, and align its growth with national agricultural development priorities, including the government’s Gebeta Le Hager initiative.',
  },
  directorsMessage: {
    title: 'Message from the Leadership',
    subtitle:
      'Connecting Global Veterinary Manufacturers with Ethiopia’s Livestock & Poultry Sector',
    quote:
      '“Our priority at Lijemrakel Trading PLC is ensuring that Ethiopia’s veterinarians, livestock producers, and poultry farms have dependable access to quality veterinary medicines, vaccines, feed premixes, and certified hatching eggs through responsible international sourcing.”',
    bodyParagraph1:
      'Founded by Lijalem Abayneh, Dr Etsubdink Negash, and Abel Girma, Lijemrakel Trading PLC unites veterinary technical competence, international trade relationships, and disciplined operations. Every product line we represent is selected with strict attention to national regulatory standards, proper storage and cold-chain handling, and clear technical documentation.',
    bodyParagraph2:
      'Alongside our core import and distribution business, we are working toward long-term investments in poultry production and hatchery development—strengthening the national agricultural value chain in alignment with initiatives such as Gebeta Le Hager.',
    signatories: [
      {
        name: 'Dr Etsubdink Negash',
        role: 'General & Technical Manager',
      },
      {
        name: 'Mr Lijalem Abayneh',
        role: 'Deputy General Manager',
      },
      {
        name: 'Ato Abel Girma',
        role: 'Financial Manager',
      },
    ],
  },
  mission:
    'To supply quality veterinary and poultry-sector products through reliable international sourcing, responsible importation, and customer-focused distribution—supporting animal health, productive farms, and the development of Ethiopia’s agricultural economy.',
  vision:
    'To become one of Ethiopia’s leading and most trusted suppliers of veterinary and poultry-sector products, while developing competitive poultry production and hatchery operations that contribute to sustainable agricultural growth.',
  coreValues: [
    {
      id: 'quality-safety',
      title: 'Quality and safety',
      description:
        'Prioritize product quality, appropriate storage, traceability, and compliance with applicable requirements.',
      iconName: 'ShieldCheck',
    },
    {
      id: 'integrity',
      title: 'Integrity',
      description:
        'Conduct business transparently and honor commitments to customers, suppliers, staff, and partners.',
      iconName: 'Scale',
    },
    {
      id: 'agricultural-impact',
      title: 'Agricultural impact',
      description:
        'Support livestock and poultry productivity and contribute to a stronger agricultural value chain.',
      iconName: 'Sprout',
    },
    {
      id: 'customer-focus',
      title: 'Customer focus',
      description:
        'Provide dependable service, clear product information, and responsive support.',
      iconName: 'HeartHandshake',
    },
    {
      id: 'professionalism',
      title: 'Professionalism',
      description:
        'Use technical knowledge, sound management, and evidence-informed decisions.',
      iconName: 'Award',
    },
    {
      id: 'partnership',
      title: 'Partnership',
      description:
        'Build durable relationships with reputable manufacturers, regulators, distributors, farms, and professionals.',
      iconName: 'Globe2',
    },
    {
      id: 'continuous-improvement',
      title: 'Continuous improvement',
      description:
        'Strengthen systems, people, technology, and operational performance over time.',
      iconName: 'TrendingUp',
    },
  ] as CoreValue[],
  whyWorkWithUs: [
    {
      title: 'Technical Expertise',
      description:
        'Veterinary-led product evaluation, regulatory registration coordination, and technical support for clinics and farms.',
      iconName: 'Stethoscope',
    },
    {
      title: 'International Sourcing',
      description:
        'Direct relationships with qualified global manufacturers of veterinary pharmaceuticals, vaccines, and premixes.',
      iconName: 'Globe',
    },
    {
      title: 'Cold-Chain & Quality Storage',
      description:
        'Disciplined warehousing, batch traceability, and temperature-controlled handling for vaccines and hatching eggs.',
      iconName: 'ThermometerSnowflake',
    },
    {
      title: 'Customer-Focused Supply',
      description:
        'Dependable distribution and clear product information for veterinary professionals, farms, hatcheries, and distributors.',
      iconName: 'Truck',
    },
  ],
  businessAreas: [
    {
      id: 'veterinary-medicines',
      title: 'Veterinary Medicines',
      subtitle: 'Therapeutics & Supplements',
      description:
        'Anthelmintics, antibiotics, antiprotozoals, and vitamin supplements supplied in line with veterinary registration and stewardship standards.',
      href: '/products/veterinary-medicines',
      status: 'Active Trading Focus',
      iconName: 'Pill',
      examples: [
        'Albendazole, Fenbendazole & Ivermectin',
        'Oxytetracycline, Penicillin–Streptomycin & Amoxicillin',
        'Toltrazuril, Amprolium & Diminazene aceturate',
        'Vitamin A-D3-E, B-Complex & Electrolytes',
      ],
    },
    {
      id: 'vaccines',
      title: 'Veterinary Vaccines',
      subtitle: 'Poultry & Livestock Immunization',
      description:
        'Vaccines for key livestock and poultry diseases, managed under continuous cold-chain storage and approved label guidelines.',
      href: '/products/vaccines',
      status: 'Active Trading Focus',
      iconName: 'Syringe',
      examples: [
        'Poultry viral & bacterial vaccines',
        'Ruminant & livestock preventive vaccines',
        'Cold-chain monitored storage (+2°C to +8°C)',
      ],
    },
    {
      id: 'feed-premixes',
      title: 'Feed Premixes',
      subtitle: 'Poultry & Livestock Nutrition',
      description:
        'Vitamin-mineral premixes and nutritional formulations with verified composition, inclusion rates, and manufacturer specifications.',
      href: '/products/feed-premixes',
      status: 'Active Trading Focus',
      iconName: 'Wheat',
      examples: [
        'Broiler & layer vitamin-mineral premixes',
        'Dairy & beef cattle nutritional premixes',
        'Verified inclusion rates & packaging specs',
      ],
    },
    {
      id: 'hormones',
      title: 'Hormones & Related Products',
      subtitle: 'Reproductive & Herd Management',
      description:
        'Authorized veterinary hormonal products for clinical reproductive and herd-management protocols where registered and permitted.',
      href: '/products/hormones',
      status: 'Active Trading Focus',
      iconName: 'Activity',
      examples: [
        'Authorized reproductive management agents',
        'Veterinary-supervised herd health protocols',
        'Strict regulatory & prescription compliance',
      ],
    },
    {
      id: 'fertilized-eggs',
      title: 'Fertilized Eggs',
      subtitle: 'Certified Hatching Eggs',
      description:
        'Fertilized hatching eggs from certified international parent-stock breeders with full veterinary certification and biosecure transport.',
      href: '/products/fertilized-eggs',
      status: 'Active Trading Focus',
      iconName: 'Egg',
      examples: [
        'Broiler & layer parent-stock hatching eggs',
        'Official veterinary health certification',
        'Climate-controlled biosecure logistics',
      ],
    },
    {
      id: 'poultry-hatchery',
      title: 'Poultry & Hatchery',
      subtitle: 'Planned Value-Chain Growth',
      description:
        'Long-term development of domestic poultry production and modern hatchery operations supporting Ethiopia’s agricultural sector.',
      href: '/poultry-hatchery',
      status: 'Planned Development (Phase 3)',
      iconName: 'Warehouse',
      examples: [
        'Feasibility & biosecurity planning',
        'Modern hatchery infrastructure roadmap',
        'Aligned with Gebeta Le Hager priorities',
      ],
    },
  ] as BusinessAreaCardItem[],
  contactCopy:
    'For product inquiries, supplier partnerships, distribution opportunities, and poultry or hatchery business discussions, please contact Lijemrakel Trading PLC using the contact details listed on this website. Our team will direct your inquiry to the appropriate department.',
  contactDetails: {
    officeLocation: 'Debrewerk Tower | Mexico | ደብረወርቅ ህንጻ | ሜክሲኮ',
    telephone: '0913514767',
    email: 'inquiries@lijemrakel.com',
    businessHours: 'Monday – Friday: 8:30 AM – 5:30 PM | Saturday: 8:30 AM – 12:30 PM',
    verificationNote:
      'Use our department inquiry form to connect directly with our General & Technical, International Business, Operations, or Finance teams.',
  },
  complianceChecklist: [
    'Exact legal company name and registration details.',
    'Correct spelling of all names and formal job titles.',
    'Which products are registered/authorized and available for sale in Ethiopia.',
    'Current import/export licenses and relevant regulatory requirements.',
    'Product claims, labels, indications, withdrawal periods, and storage details against approved documentation.',
    'Cold-chain and transport requirements for vaccines and other temperature-sensitive products.',
    'Supplier permissions for logos, product photos, and technical documents.',
    'Company address, phone, email, social media, and inquiry contact.',
    'Whether poultry production and hatchery are operational or planned.',
    'Board approval of the mission, vision, strategy, and public profile.',
  ],
};
