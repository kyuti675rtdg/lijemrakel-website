import { ProductItem } from '@/types';

export const CATALOGUE_PRODUCTS: ProductItem[] = [
  // ==========================================
  // A. VETERINARY MEDICINES — ANTHELMINTICS
  // ==========================================
  {
    id: 'MED-ANT-01',
    slug: 'albendazole-veterinary-anthelmintic',
    name: 'Albendazole Oral Suspension & Bolus',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Anthelmintics (dewormers)',
    classification: 'Veterinary Medicine',
    activeIngredientOrComposition:
      'Albendazole USP/BP (Broad-spectrum benzimidazole anthelmintic)',
    dosageForm: 'Oral Suspension / Scored Bolus',
    packSize: '1 Liter Jerrican / Box of 50 Boluses',
    intendedSpecies: ['Cattle', 'Sheep', 'Goats', 'Camels'],
    approvedIndicationsSummary:
      'Broad-spectrum control and treatment of gastrointestinal roundworms, lungworms, tapeworms, and adult liver flukes in accordance with approved market labeling.',
    storageConditions:
      'Store below 25°C–30°C in a dry place, protected from direct sunlight.',
    coldChainRequired: false,
    withdrawalPeriodNote:
      'Observe meat and milk withdrawal periods as printed on the approved manufacturer label.',
    manufacturerStatus: 'International GMP Veterinary Manufacturer',
    authorizationStatusNote: 'Supplied in accordance with national veterinary registration',
    stewardshipWarning:
      'Use the correct product label and species-specific dosing directions approved for the market.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Veterinary pharmaceutical category profile.',
    featured: true,
  },
  {
    id: 'MED-ANT-02',
    slug: 'fenbendazole-veterinary-dewormer',
    name: 'Fenbendazole Oral Drench & Granules',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Anthelmintics (dewormers)',
    classification: 'Veterinary Medicine',
    activeIngredientOrComposition: 'Fenbendazole BP/EP (Benzimidazole anthelmintic)',
    dosageForm: 'Oral Drench Suspension / Bolus / Powder',
    packSize: '500 mL / 1 Liter / Sachet Pack',
    intendedSpecies: ['Cattle', 'Sheep', 'Goats', 'Poultry'],
    approvedIndicationsSummary:
      'Targeted control of mature and immature gastrointestinal nematodes and lungworms in livestock and poultry per approved label directions.',
    storageConditions:
      'Store in original tightly closed container below 30°C, protected from light.',
    coldChainRequired: false,
    withdrawalPeriodNote:
      'Follow approved species-specific meat, milk, and egg withdrawal intervals.',
    manufacturerStatus: 'International GMP Veterinary Manufacturer',
    authorizationStatusNote: 'Supplied in accordance with national veterinary registration',
    stewardshipWarning:
      'Administer strictly according to accurate animal body weight and approved species directions.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Livestock antiparasitic health category profile.',
    featured: false,
  },
  {
    id: 'MED-ANT-03',
    slug: 'ivermectin-injectable-endectocide',
    name: 'Ivermectin Veterinary Solution',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Anthelmintics (dewormers)',
    classification: 'Veterinary Medicine',
    activeIngredientOrComposition:
      'Ivermectin (Macrocyclic lactone endectocide — sterile solution)',
    dosageForm: 'Sterile Injectable Solution / Oral Solution',
    packSize: '50 mL / 100 mL Multi-dose Vial',
    intendedSpecies: ['Cattle', 'Sheep', 'Goats', 'Camels'],
    approvedIndicationsSummary:
      'Control of internal gastrointestinal and pulmonary nematodes as well as external parasites (mites, ticks, lice, grubs) according to approved market labeling.',
    storageConditions:
      'Store below 25°C–30°C inside protective outer carton away from light.',
    coldChainRequired: false,
    withdrawalPeriodNote:
      'Observe pre-slaughter meat withdrawal period and lactating dairy restrictions per approved leaflet.',
    manufacturerStatus: 'International GMP Veterinary Manufacturer',
    authorizationStatusNote: 'Supplied in accordance with national veterinary registration',
    stewardshipWarning:
      'Use only via the route of administration and in the target species specified on the approved product label.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Veterinary injectable endectocide profile.',
    featured: true,
  },

  // ==========================================
  // A. VETERINARY MEDICINES — ANTIBIOTICS
  // ==========================================
  {
    id: 'MED-ABX-01',
    slug: 'oxytetracycline-veterinary-antibiotic',
    name: 'Oxytetracycline Veterinary Preparation',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Antibiotics',
    classification: 'Veterinary Medicine',
    activeIngredientOrComposition:
      'Oxytetracycline Hydrochloride / Dihydrate (10% / 20% LA Injectable or Water-Soluble Powder)',
    dosageForm: 'Sterile Injectable Solution / Water-Soluble Powder',
    packSize: '100 mL Amber Vial / 100 g – 1 kg Foil Pack',
    intendedSpecies: ['Cattle', 'Sheep', 'Goats', 'Poultry'],
    approvedIndicationsSummary:
      'Treatment of bacterial infections caused by oxytetracycline-susceptible organisms in livestock and poultry, supplied strictly under veterinary prescription.',
    storageConditions:
      'Store in a cool, dry place below 25°C, protected from light.',
    coldChainRequired: false,
    withdrawalPeriodNote:
      'Strict meat, milk, and egg withdrawal periods apply per the approved manufacturer specification.',
    manufacturerStatus: 'International GMP Veterinary Manufacturer',
    authorizationStatusNote: 'Prescription veterinary medicine — registration verified',
    stewardshipWarning:
      'Supplied and promoted only in line with applicable veterinary prescription, antimicrobial stewardship, and registration requirements.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Veterinary antimicrobial preparation profile.',
    featured: true,
  },
  {
    id: 'MED-ABX-02',
    slug: 'penicillin-streptomycin-combination',
    name: 'Penicillin–Streptomycin Injectable Suspension',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Antibiotics',
    classification: 'Veterinary Medicine',
    activeIngredientOrComposition:
      'Procaine Penicillin G + Dihydrostreptomycin Sulphate',
    dosageForm: 'Sterile Aqueous Suspension for Injection',
    packSize: '100 mL Multi-dose Vial',
    intendedSpecies: ['Cattle', 'Sheep', 'Goats'],
    approvedIndicationsSummary:
      'Systemic bacterial infections responsive to combined beta-lactam and aminoglycoside therapy under licensed veterinary oversight.',
    storageConditions:
      'Store between +8°C and +25°C (or refrigerate per specific approved manufacturer label). Shake well before use.',
    coldChainRequired: false,
    withdrawalPeriodNote:
      'Strict meat and milk withdrawal periods must be observed in compliance with the approved label.',
    manufacturerStatus: 'International GMP Veterinary Manufacturer',
    authorizationStatusNote: 'Prescription veterinary medicine — registration verified',
    stewardshipWarning:
      'For veterinary prescription use only. Follow exact dosage regimen and withdrawal intervals.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Prescription veterinary suspension profile.',
    featured: false,
  },
  {
    id: 'MED-ABX-03',
    slug: 'amoxicillin-veterinary-preparation',
    name: 'Amoxicillin Trihydrate Veterinary Preparation',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Antibiotics',
    classification: 'Veterinary Medicine',
    activeIngredientOrComposition:
      'Amoxicillin Trihydrate (Water-Soluble Powder or Long-Acting Injectable)',
    dosageForm: 'Water-Soluble Powder / Long-Acting Injectable Suspension',
    packSize: '100 mL Vial / 500 g – 1 kg Container',
    intendedSpecies: ['Poultry', 'Cattle', 'Sheep', 'Goats'],
    approvedIndicationsSummary:
      'Respiratory, alimentary, and systemic infections caused by amoxicillin-sensitive bacteria under veterinary prescription.',
    storageConditions:
      'Store below 25°C in a dry environment. Reseal containers tightly after opening.',
    coldChainRequired: false,
    withdrawalPeriodNote:
      'Adhere strictly to approved meat, milk, and egg withdrawal periods specified on the product label.',
    manufacturerStatus: 'International GMP Veterinary Manufacturer',
    authorizationStatusNote: 'Prescription veterinary medicine — registration verified',
    stewardshipWarning:
      'Promote and dispense solely in accordance with veterinary prescription and responsible antimicrobial use guidelines.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Veterinary pharmaceutical category profile.',
    featured: false,
  },

  // ==========================================
  // A. VETERINARY MEDICINES — ANTIPROTOZOALS
  // ==========================================
  {
    id: 'MED-APR-01',
    slug: 'toltrazuril-anticoccidial-solution',
    name: 'Toltrazuril Oral Anticoccidial Solution',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Antiprotozoals',
    classification: 'Veterinary Medicine',
    activeIngredientOrComposition:
      'Toltrazuril 2.5% Oral Solution for drinking water administration',
    dosageForm: 'Oral Solution for Drinking Water',
    packSize: '100 mL / 500 mL / 1 Liter Bottle',
    intendedSpecies: ['Poultry'],
    approvedIndicationsSummary:
      'Prevention and treatment of clinical coccidiosis (Eimeria species) in poultry flocks as authorized on the registered product label.',
    storageConditions:
      'Store below 25°C in original container. Prepare fresh medicated drinking water daily.',
    coldChainRequired: false,
    withdrawalPeriodNote:
      'Observe meat withdrawal period and laying-hen restrictions as stated on the approved leaflet.',
    manufacturerStatus: 'International GMP Veterinary Manufacturer',
    authorizationStatusNote: 'Supplied in accordance with national veterinary registration',
    stewardshipWarning:
      'Confirm target species, indications, withdrawal periods, and local authorization prior to administration.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Poultry health management profile.',
    featured: true,
  },
  {
    id: 'MED-APR-02',
    slug: 'amprolium-water-soluble-anticoccidial',
    name: 'Amprolium Water-Soluble Powder',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Antiprotozoals',
    classification: 'Veterinary Medicine',
    activeIngredientOrComposition: 'Amprolium Hydrochloride (Thiamine analogue anticoccidial)',
    dosageForm: 'Water-Soluble Oral Powder',
    packSize: '100 g / 500 g / 1 kg Sachet or Jar',
    intendedSpecies: ['Poultry', 'Cattle', 'Sheep', 'Goats'],
    approvedIndicationsSummary:
      'Management of intestinal and cecal coccidiosis in poultry and young ruminants according to registered label directions.',
    storageConditions:
      'Store in a cool, dry place below 25°C. Protect from moisture after opening.',
    coldChainRequired: false,
    withdrawalPeriodNote:
      'Confirm meat and egg withdrawal intervals per approved manufacturer documentation.',
    manufacturerStatus: 'International GMP Veterinary Manufacturer',
    authorizationStatusNote: 'Supplied in accordance with national veterinary registration',
    stewardshipWarning:
      'Confirm species-specific dosage and treatment duration on the approved product label.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Poultry and ruminant antiprotozoal profile.',
    featured: false,
  },
  {
    id: 'MED-APR-03',
    slug: 'diminazene-aceturate-trypanocide',
    name: 'Diminazene Aceturate Granules for Injection',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Antiprotozoals',
    classification: 'Veterinary Medicine',
    activeIngredientOrComposition:
      'Diminazene Aceturate + Phenazone (Sterile reconstitutable granules)',
    dosageForm: 'Granules / Powder for Reconstitution & Injection',
    packSize: '2.36 g / 23.6 g Sachet Box',
    intendedSpecies: ['Cattle', 'Sheep', 'Goats'],
    approvedIndicationsSummary:
      'Treatment of protozoal hemoparasitic infections (such as Trypanosomosis and Babesiosis) in livestock per authorized veterinary indications.',
    storageConditions:
      'Store dry sachets below 25°C. Use reconstituted solution within the period stated on the approved label.',
    coldChainRequired: false,
    withdrawalPeriodNote:
      'Strict meat and milk withdrawal periods apply per the approved manufacturer leaflet.',
    manufacturerStatus: 'International GMP Veterinary Manufacturer',
    authorizationStatusNote: 'Supplied in accordance with national veterinary registration',
    stewardshipWarning:
      'Administer via deep intramuscular injection at accurate body-weight dosage under veterinary guidance.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Cattle hemoparasite management profile.',
    featured: false,
  },

  // ==========================================
  // A. VETERINARY MEDICINES — MULTIVITAMINS & SUPPLEMENTS
  // ==========================================
  {
    id: 'MED-VIT-01',
    slug: 'vitamin-a-d3-e-veterinary-preparation',
    name: 'Vitamin A-D3-E Nutritional Preparation',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Multivitamins and nutritional supplements',
    classification: 'Nutritional / Feed Supplement',
    activeIngredientOrComposition:
      'Balanced Vitamin A (Retinol), Vitamin D3 (Cholecalciferol), and Vitamin E (Alpha-Tocopherol)',
    dosageForm: 'Oral Liquid for Drinking Water / Sterile Solution',
    packSize: '100 mL / 500 mL / 1 Liter',
    intendedSpecies: ['Poultry', 'Cattle', 'Sheep', 'Goats'],
    approvedIndicationsSummary:
      'Nutritional vitamin supplementation during periods of physiological stress, peak production, rapid growth, or deficiency risk.',
    storageConditions: 'Store below 25°C away from direct light and heat sources.',
    coldChainRequired: false,
    withdrawalPeriodNote: 'Follow approved manufacturer label guidance.',
    manufacturerStatus: 'International Veterinary Nutrition Manufacturer',
    authorizationStatusNote: 'Nutritional supplement — distinct from therapeutic medicines',
    stewardshipWarning:
      'Clearly distinguish nutritional vitamin supplements from therapeutic veterinary medicines and follow approved label claims.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Livestock and poultry vitamin supplementation profile.',
    featured: false,
  },
  {
    id: 'MED-VIT-02',
    slug: 'b-complex-vitamins-preparation',
    name: 'B-Complex Vitamins Preparation',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Multivitamins and nutritional supplements',
    classification: 'Nutritional / Feed Supplement',
    activeIngredientOrComposition:
      'Vitamins B1, B2, B6, B12, Nicotinamide, and D-Panthenol',
    dosageForm: 'Oral Liquid / Water-Soluble Powder / Injectable Solution',
    packSize: '100 mL / 500 mL / 1 Liter Bottle',
    intendedSpecies: ['Poultry', 'Cattle', 'Sheep', 'Goats'],
    approvedIndicationsSummary:
      'B-vitamin supplementation supporting energy metabolism, appetite recovery, hepatic function, and convalescence in livestock and poultry.',
    storageConditions: 'Store in a cool, dark place below 25°C. Protect from light.',
    coldChainRequired: false,
    withdrawalPeriodNote: 'Follow approved manufacturer label guidance.',
    manufacturerStatus: 'International Veterinary Nutrition Manufacturer',
    authorizationStatusNote: 'Nutritional supplement — distinct from therapeutic medicines',
    stewardshipWarning:
      'Clearly distinguish nutritional vitamin preparations from therapeutic medicines and adhere to label directions.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'B-complex vitamin preparation profile.',
    featured: false,
  },
  {
    id: 'MED-VIT-03',
    slug: 'electrolyte-and-vitamin-combinations',
    name: 'Electrolyte & Vitamin Combination',
    categorySlug: 'veterinary-medicines',
    categoryName: 'Veterinary Medicines',
    subcategory: 'Multivitamins and nutritional supplements',
    classification: 'Nutritional / Feed Supplement',
    activeIngredientOrComposition:
      'Balanced Sodium, Potassium, Magnesium, Citrate/Bicarbonate Electrolytes + Vitamin C & Multivitamins',
    dosageForm: 'Water-Soluble Oral Powder',
    packSize: '100 g / 500 g / 1 kg Foil Sachet or Jar',
    intendedSpecies: ['Poultry', 'Cattle', 'Sheep', 'Goats'],
    approvedIndicationsSummary:
      'Nutritional rehydration, heat-stress mitigation, chick arrival support, and post-vaccination recovery via drinking water.',
    storageConditions:
      'Store in a cool, dry place below 25°C. Reseal tightly to prevent moisture absorption.',
    coldChainRequired: false,
    withdrawalPeriodNote:
      'Zero withdrawal period when used as an oral nutritional electrolyte supplement.',
    manufacturerStatus: 'International Veterinary Nutrition Manufacturer',
    authorizationStatusNote: 'Nutritional electrolyte and vitamin supplement',
    stewardshipWarning:
      'Oral nutritional and electrolyte supplement — does not replace specific antimicrobial or antiparasitic therapy.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Poultry and livestock hydration supplement profile.',
    featured: false,
  },

  // ==========================================
  // B. VETERINARY VACCINES
  // ==========================================
  {
    id: 'VAC-PLT-01',
    slug: 'poultry-disease-prevention-vaccines',
    name: 'Poultry Viral & Bacterial Vaccines',
    categorySlug: 'vaccines',
    categoryName: 'Veterinary Vaccines',
    classification: 'Biological / Vaccine',
    activeIngredientOrComposition:
      'Freeze-dried live attenuated and inactivated oil-emulsion poultry vaccines',
    dosageForm: 'Lyophilized Freeze-Dried Vial with Diluent / Inactivated Emulsion',
    packSize: '500 Doses / 1,000 Doses / 2,500 Doses Vials',
    intendedSpecies: ['Poultry'],
    approvedIndicationsSummary:
      'Active immunization of healthy poultry flocks against key viral and bacterial poultry diseases, subject to national registration and authorized vaccination schedules.',
    storageConditions:
      'MANDATORY COLD CHAIN: Store and transport continuously between +2°C and +8°C in the dark. Do not freeze.',
    coldChainRequired: true,
    withdrawalPeriodNote:
      'Follow vaccine-specific pre-slaughter withdrawal intervals printed on the approved manufacturer leaflet.',
    manufacturerStatus: 'International Veterinary Biologicals Manufacturer',
    authorizationStatusNote: 'Subject to registration, cold-chain certification & availability',
    stewardshipWarning:
      'Maintain unbroken +2°C to +8°C storage from reception through farm administration. Follow approved label reconstitution instructions.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Cold-chain veterinary biologicals profile.',
    featured: true,
  },
  {
    id: 'VAC-LVS-02',
    slug: 'livestock-ruminant-preventive-vaccines',
    name: 'Livestock & Ruminant Preventive Vaccines',
    categorySlug: 'vaccines',
    categoryName: 'Veterinary Vaccines',
    classification: 'Biological / Vaccine',
    activeIngredientOrComposition:
      'Authorized ruminant and livestock biological immunogens',
    dosageForm: 'Injectable Suspension / Reconstitutable Freeze-Dried Vaccine',
    packSize: '50 Doses / 100 Doses Multi-dose Vial',
    intendedSpecies: ['Cattle', 'Sheep', 'Goats'],
    approvedIndicationsSummary:
      'Preventive herd immunization against economically significant livestock diseases in accordance with national veterinary guidelines.',
    storageConditions:
      'MANDATORY COLD CHAIN: Store between +2°C and +8°C protected from light.',
    coldChainRequired: true,
    withdrawalPeriodNote: 'Observe approved label withdrawal period prior to slaughter.',
    manufacturerStatus: 'International Veterinary Biologicals Manufacturer',
    authorizationStatusNote: 'Subject to registration, cold-chain certification & availability',
    stewardshipWarning:
      'Administer only to healthy animals under veterinary supervision using sterile equipment and unbroken cold-chain handling.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Livestock immunization cold-chain profile.',
    featured: false,
  },

  // ==========================================
  // C. FEED PREMIXES
  // ==========================================
  {
    id: 'PRM-PLT-01',
    slug: 'poultry-vitamin-mineral-premix',
    name: 'Broiler & Layer Vitamin-Mineral Premix',
    categorySlug: 'feed-premixes',
    categoryName: 'Feed Premixes',
    classification: 'Nutritional / Feed Supplement',
    activeIngredientOrComposition:
      'Vitamins (A, D3, E, K3, B-group), Trace Minerals (Zn, Mn, Fe, Cu, I, Se), Choline, and Antioxidants',
    dosageForm: 'Free-Flowing Micro-Granular Powder for Feed Inclusion',
    packSize: '25 kg Multi-Wall Moisture-Barrier Bag',
    intendedSpecies: ['Poultry'],
    approvedIndicationsSummary:
      'Complete vitamin and trace-mineral fortification for commercial starter, grower, finisher, layer, and breeder poultry rations.',
    storageConditions:
      'Store in a cool, dry, well-ventilated warehouse on pallets away from direct sunlight.',
    coldChainRequired: false,
    withdrawalPeriodNote: 'Not applicable (nutritional feed premix).',
    manufacturerStatus: 'International Animal Nutrition Manufacturer',
    authorizationStatusNote: 'Supplied with official composition & inclusion specification',
    stewardshipWarning:
      'Ensure homogeneous mixing in complete feed according to the manufacturer’s recommended inclusion rate.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Poultry vitamin-mineral feed premix profile.',
    featured: true,
  },
  {
    id: 'PRM-LVS-02',
    slug: 'livestock-ruminant-nutritional-premix',
    name: 'Dairy & Beef Cattle Nutritional Premix',
    categorySlug: 'feed-premixes',
    categoryName: 'Feed Premixes',
    classification: 'Nutritional / Feed Supplement',
    activeIngredientOrComposition:
      'Macro & Trace Minerals (Ca, P, Mg, Zn, Cu, Co, Se, I) + Essential Vitamins (A, D3, E)',
    dosageForm: 'Concentrated Nutritional Premix Powder / Granules',
    packSize: '25 kg Heavy-Duty Bag',
    intendedSpecies: ['Cattle', 'Sheep', 'Goats'],
    approvedIndicationsSummary:
      'Balances commercial dairy, beef fattening, and small-ruminant concentrate feeds to support milk yield, fertility, and growth.',
    storageConditions: 'Store on pallets in a dry, cool feed store protected from humidity.',
    coldChainRequired: false,
    withdrawalPeriodNote: 'Not applicable (approved nutritional feed premix).',
    manufacturerStatus: 'International Animal Nutrition Manufacturer',
    authorizationStatusNote: 'Supplied with official composition & inclusion specification',
    stewardshipWarning:
      'Follow species-specific inclusion rates on the official product specification.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Ruminant nutritional premix profile.',
    featured: false,
  },

  // ==========================================
  // D. HORMONES AND RELATED PRODUCTS
  // ==========================================
  {
    id: 'HRM-REP-01',
    slug: 'authorized-veterinary-reproductive-hormones',
    name: 'Authorized Veterinary Reproductive Hormones',
    categorySlug: 'hormones',
    categoryName: 'Hormones and Related Products',
    classification: 'Reproductive / Herd-Management Hormone',
    activeIngredientOrComposition:
      'Authorized veterinary reproductive hormone preparations (e.g., Prostaglandin F2α / GnRH analogues)',
    dosageForm: 'Sterile Injectable Solution for Veterinary Clinical Use',
    packSize: '10 mL / 20 mL / 50 mL Vial',
    intendedSpecies: ['Cattle'],
    approvedIndicationsSummary:
      'Authorized veterinary reproductive management, estrus synchronization, and clinical herd-health applications where registered and legally permitted.',
    storageConditions:
      'Store below 25°C (or refrigerate between +2°C and +8°C per approved manufacturer label), protected from light.',
    coldChainRequired: true,
    withdrawalPeriodNote:
      'Observe approved meat and milk withdrawal periods printed on the registered product leaflet.',
    manufacturerStatus: 'International GMP Veterinary Pharmaceutical Manufacturer',
    authorizationStatusNote: 'Restricted to registered & legally permitted veterinary use',
    stewardshipWarning:
      'For use strictly by licensed veterinarians in authorized reproductive or herd-management applications. Never imply unapproved uses.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Dairy reproductive herd-management profile.',
    featured: true,
  },

  // ==========================================
  // E. FERTILIZED EGGS
  // ==========================================
  {
    id: 'EGG-HTC-01',
    slug: 'certified-poultry-fertilized-hatching-eggs',
    name: 'Certified Broiler & Layer Hatching Eggs',
    categorySlug: 'fertilized-eggs',
    categoryName: 'Fertilized Eggs',
    classification: 'Certified Hatching Input',
    activeIngredientOrComposition:
      'Specific-Pathogen-Monitored Commercial Broiler & Layer Parent-Stock Fertilized Hatching Eggs',
    dosageForm: 'Sanitized, Graded Hatching Eggs in Export Setter Trays',
    packSize: '360 Eggs per Biosecure Ventilated Export Carton',
    intendedSpecies: ['Poultry'],
    approvedIndicationsSummary:
      'Certified fertilized hatching eggs imported for commercial hatchery incubation, backed by breeder flock health certificates, import permits, and biosecure transport.',
    storageConditions:
      'CLIMATE-CONTROLLED LOGISTICS: Maintain holding temperature of 15°C–18°C and 75%–80% relative humidity.',
    coldChainRequired: true,
    withdrawalPeriodNote:
      'Dedicated exclusively for commercial hatchery incubation under veterinary biosecurity oversight.',
    manufacturerStatus: 'Certified International Poultry Breeder Supplier',
    authorizationStatusNote: 'Subject to veterinary health certificate & import permit',
    stewardshipWarning:
      'Requires official country-of-origin veterinary certification, parent-flock health documentation, and climate-controlled transit.',
    verificationStatus: 'category-example-pending-verification',
    image:
      'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Certified hatching eggs profile.',
    featured: true,
  },
];

export function getProductBySlug(slug: string): ProductItem | undefined {
  return CATALOGUE_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): ProductItem[] {
  return CATALOGUE_PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}
