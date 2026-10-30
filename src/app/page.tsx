import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronsRight,
  Globe,
  Pill,
  Syringe,
  Wheat,
  Activity,
  Egg,
  Warehouse,
  CheckCircle2,
  Compass,
  Eye,
  Clock,
  Building2,
  Handshake,
  PhoneCall,
  Briefcase,
  TrendingUp,
  Sparkles,
  Star,
} from 'lucide-react';
import { COMPANY_PROFILE } from '@/data/companyProfile';
import { CATALOGUE_PRODUCTS } from '@/data/catalogueProducts';
import {
  STRATEGY_PHASES,
  STRATEGY_FRAMEWORK_DISCLAIMER,
} from '@/data/strategyPhases';
import { MANAGEMENT_TEAM } from '@/data/leadershipData';
import { ProductCard } from '@/components/products/ProductCard';
import { SplitPillButton } from '@/components/ui/SplitPillButton';
import { FadeIn } from '@/components/ui/MotionWrapper';
import {
  readDb,
  DEFAULT_SITE_IMAGES,
  getRouteSeoMetadata,
} from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return getRouteSeoMetadata('/', {
    title:
      'Lijemrakel Trading PLC | Veterinary, Poultry & Agricultural Import-Export Solutions',
    description:
      'Supporting Ethiopia’s Agriculture Through Reliable Veterinary and Poultry Solutions. Importing veterinary medicines, vaccines, feed premixes, authorized hormones, and fertilized eggs.',
  });
}

const BUSINESS_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Pill,
  Syringe,
  Wheat,
  Activity,
  Egg,
  Warehouse,
};

export default function HomePage() {
  const db = readDb();
  const siteImages = {
    ...DEFAULT_SITE_IMAGES,
    ...(db.siteImages || {}),
  };
  const allProducts =
    Array.isArray(db.products) && db.products.length > 0
      ? db.products
      : CATALOGUE_PRODUCTS;
  const featuredProducts = allProducts
    .filter((p) => p.featured)
    .slice(0, 3);
  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 3);
  const teamMembers =
    Array.isArray(db.team) && db.team.length > 0 ? db.team : MANAGEMENT_TEAM;
  const deputyManager =
    teamMembers.find(
      (m) =>
        m.id === 'leader-lijalem' ||
        m.name.toLowerCase().includes('lijalem')
    ) || teamMembers[1] || MANAGEMENT_TEAM[1];

  return (
    <div className="bg-white dark:bg-[#070B1E] transition-colors">
      {/* =====================================================================
          1. FULL-BLEED STRATEGIC GLOBAL BUSINESS HERO SECTION
          (Fitted to Official Lijemrakel Handshake & Wall Emblem Photo)
      ===================================================================== */}
      <section className="relative bg-[#0B0E29] text-white overflow-hidden lg:min-h-[620px] flex flex-col lg:flex-row lg:items-center">
        {/* Right-Side Fitted Lijemrakel Handshake Photo (Desktop Bleed + Smooth Left Blend) */}
        <div className="relative w-full h-[320px] sm:h-[420px] lg:h-auto lg:absolute lg:inset-y-0 lg:right-0 lg:w-[60%] z-0 order-2 lg:order-none">
          <Image
            key={siteImages.homeHeroImage}
            src={siteImages.homeHeroImage}
            alt="Lijemrakel Trading PLC leadership partnership handshake in front of official company emblem"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-[center_18%]"
            priority
            unoptimized
          />
          {/* Smooth Left-Edge Blend into Deep Navy so both people & the LIJ EMRAKEL wall logo remain 100% clear */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#0B0E29] via-[#0B0E29]/75 to-transparent" />
          <div className="lg:hidden absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0B0E29] to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10 w-full order-1 lg:order-none">
          <div className="max-w-xl lg:max-w-[520px] space-y-6">
            <FadeIn className="space-y-5">
              {/* Top Glassmorphic Trust Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
                <span className="font-bold text-white">5.0</span>
                <span className="flex items-center gap-0.5 text-brand-orange">
                  <Star className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                  <Star className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                  <Star className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                  <Star className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                  <Star className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                </span>
                <span className="text-white/85">Global Import &amp; Export</span>
              </div>

              {/* Bold Multi-Line Uppercase Display Headline */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[48px] font-extrabold uppercase tracking-tight leading-[1.08] text-white">
                RELIABLE — GLOBAL{' '}
                <span className="text-brand-orange">VETERINARY &amp; POULTRY</span>{' '}
                SOLUTIONS
              </h1>

              {/* Verbatim Company Headline & Supporting Description */}
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                <strong className="text-white font-semibold">
                  {COMPANY_PROFILE.hero.headline}.
                </strong>{' '}
                {COMPANY_PROFILE.hero.supportingLine}
              </p>

              {/* Bottom Action Row: Split-Pill CTA + Circular Call/Inquiry Badge */}
              <div className="pt-2 flex flex-wrap items-center gap-5">
                <SplitPillButton
                  href={COMPANY_PROFILE.hero.primaryCta.href}
                  label={COMPANY_PROFILE.hero.primaryCta.label}
                  variant="dark"
                />

                <a
                  href="tel:0913514767"
                  className="inline-flex items-center gap-3 group"
                >
                  <span className="w-11 h-11 rounded-full bg-brand-orange text-brand-navy flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-white/60">
                      CALL US DIRECTLY
                    </span>
                    <span className="block text-sm font-heading font-bold text-white group-hover:text-brand-orange transition-colors">
                      0913514767
                    </span>
                  </span>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. "OUR APPROACH" — 3 SIGNATURE CUTOUT CARDS SECTION
          (White Card • Vibrant Accent Card • Deep Navy Card with Bottom-Left Notch)
      ===================================================================== */}
      <section className="py-20 lg:py-28 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 2-Column Asymmetric Header */}
          <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-border text-xs font-bold text-brand-navy mb-4">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Our Approach</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-brand-navy leading-[1.15] tracking-tight">
                Essential capabilities for modern agricultural success
              </h2>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <p className="text-sm sm:text-base text-brand-body leading-relaxed">
                Explore integrated global sourcing approaches that strengthen veterinary supply chains, improve livestock productivity, and support long-term poultry development across Ethiopia.
              </p>
            </div>
          </FadeIn>

          {/* 3 Signature Cutout Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* CARD 1: Crisp White Card */}
            <div className="relative rounded-[24px] bg-white p-8 pb-24 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 flex items-center justify-start text-brand-navy mb-6">
                  <Briefcase className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="font-heading text-xl font-bold text-brand-navy leading-snug">
                  Global Import &amp; Export Trade
                </h3>
                <p className="text-sm text-brand-body mt-3 leading-relaxed">
                  We partner with dependable international manufacturers to supply quality-verified veterinary and agricultural inputs to Ethiopia.
                </p>
              </div>

              {/* Bottom-Left Inverted Cutout Tab */}
              <div className="cutout-notch absolute bottom-0 left-0 bg-[#F7F7F3] pt-3 pr-4 rounded-tr-[22px]">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-brand-border text-xs font-heading font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                >
                  <span>Explore More</span>
                  <ChevronsRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* CARD 2: Vibrant Brand Accent Card with Subtle Circle Watermark */}
            <div className="relative rounded-[24px] bg-brand-orange p-8 pb-24 flex flex-col justify-between shadow-sm overflow-hidden">
              {/* Decorative Concentric Circle Watermark */}
              <div
                className="pointer-events-none absolute -bottom-16 -right-16 w-52 h-52 rounded-full border-[24px] border-brand-navy/10"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-brand-navy/10"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="w-12 h-12 flex items-center justify-start text-brand-navy mb-6">
                  <TrendingUp className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="font-heading text-xl font-bold text-brand-navy leading-snug">
                  Veterinary &amp; Nutritional Supply
                </h3>
                <p className="text-sm text-brand-navy/85 mt-3 leading-relaxed">
                  Comprehensive portfolio of veterinary medicines, cold-chain vaccines, feed premixes, and authorized reproductive hormones.
                </p>
              </div>

              {/* Bottom-Left Inverted Cutout Tab */}
              <div className="cutout-notch absolute bottom-0 left-0 bg-[#F7F7F3] pt-3 pr-4 rounded-tr-[22px] z-10">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-orange text-xs font-heading font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                >
                  <span>Explore More</span>
                  <ChevronsRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* CARD 3: Deep Midnight Navy Card */}
            <div className="relative rounded-[24px] bg-[#0B0E29] p-8 pb-24 flex flex-col justify-between shadow-sm text-white">
              <div>
                <div className="w-12 h-12 flex items-center justify-start text-brand-orange mb-6">
                  <Handshake className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white leading-snug">
                  Poultry &amp; Hatchery Development
                </h3>
                <p className="text-sm text-white/75 mt-3 leading-relaxed">
                  Supplying fertilized hatching eggs today while advancing our strategic plan for modern poultry production and hatchery facilities.
                </p>
              </div>

              {/* Bottom-Left Inverted Cutout Tab */}
              <div className="cutout-notch absolute bottom-0 left-0 bg-[#F7F7F3] pt-3 pr-4 rounded-tr-[22px]">
                <Link
                  href="/poultry-hatchery"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0B0E29] text-xs font-heading font-bold text-white hover:bg-brand-orange hover:text-brand-navy transition-colors"
                >
                  <span>Explore More</span>
                  <ChevronsRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. "WHO WE ARE?" — ASYMMETRIC BENTO COLLAGE & EXECUTIVE PROFILE
          (Matches Reference Bento Collage, CEO Signature & Skills/Rating Boxes)
      ===================================================================== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* LEFT COLUMN (6 cols): 3-Piece Bento Collage */}
            <FadeIn className="lg:col-span-6 space-y-4">
              {/* Top Wide Corporate Collaboration Image */}
              <div className="relative h-64 sm:h-72 w-full rounded-[24px] overflow-hidden shadow-sm">
                <Image
                  key={siteImages.homeAboutMainImage}
                  src={siteImages.homeAboutMainImage}
                  alt="Lijemrakel Trading PLC executive office in Addis Ababa"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top"
                  unoptimized
                />
              </div>

              {/* Bottom 2-Piece Bento Row */}
              <div className="grid grid-cols-12 gap-4">
                {/* Bottom-Left Vibrant Accent Stat Card */}
                <div className="col-span-5 rounded-[24px] bg-brand-orange p-6 flex flex-col items-center justify-center text-center text-brand-navy">
                  <div className="w-9 h-9 rounded-full bg-[#0B0E29] text-brand-orange flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="font-heading text-3xl sm:text-4xl font-extrabold leading-none">
                    5+
                  </div>
                  <div className="text-xs font-semibold mt-2 leading-snug">
                    Core Veterinary &amp; Poultry Divisions
                  </div>
                </div>

                {/* Bottom-Right Strategic Consultation Photo */}
                <div className="col-span-7 relative h-48 sm:h-52 rounded-[24px] overflow-hidden shadow-sm">
                  <Image
                    key={siteImages.homeAboutAccentImage}
                    src={siteImages.homeAboutAccentImage}
                    alt="Lijemrakel Trading PLC leadership partnership"
                    fill
                    sizes="(max-width: 1024px) 60vw, 30vw"
                    className="object-cover object-top"
                    unoptimized
                  />
                </div>
              </div>
            </FadeIn>

            {/* RIGHT COLUMN (6 cols): "Who We Are?" Copy, CTA + Manager Profile & 2 Bento Boxes */}
            <FadeIn delay={0.1} className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F3] border border-brand-border text-xs font-bold text-brand-navy">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Who We Are?</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-brand-navy leading-[1.15] tracking-tight">
                Comprehensive solutions for veterinary &amp; agricultural excellence
              </h2>

              <p className="text-sm sm:text-base text-brand-body leading-relaxed">
                Lijemrakel Trading PLC is an Ethiopian company engaged in import and export, with a primary focus on livestock and poultry. Aligned with national agricultural priorities including{' '}
                <em className="font-semibold text-brand-navy not-italic">
                  Gebeta Le Hager
                </em>
                , we connect reliable international manufacturers with veterinary professionals, farms, and distributors across Ethiopia.
              </p>

              {/* Split-Pill Button + Deputy General Manager Badge (Side-by-Side) */}
              <div className="pt-2 flex flex-wrap sm:flex-nowrap items-center gap-6">
                <SplitPillButton
                  href="/about"
                  label="More About Us"
                  variant="light"
                />

                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-orange shrink-0">
                    <Image
                      key={
                        deputyManager?.portraitUrl ||
                        '/uploads/1793297131637-photo_2026-04-06_04-12-56.jpg'
                      }
                      src={
                        deputyManager?.portraitUrl ||
                        '/uploads/1793297131637-photo_2026-04-06_04-12-56.jpg'
                      }
                      alt={deputyManager?.displayName || 'Mr Lijalem Abayneh'}
                      fill
                      sizes="48px"
                      className="object-cover object-top"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="font-heading text-sm font-bold text-brand-navy">
                      {deputyManager?.displayName || 'Mr Lijalem Abayneh'}
                    </div>
                    <div className="text-xs text-brand-muted">
                      {deputyManager?.roleTitle || 'Deputy General Manager'} — Lijemrakel
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom 2 Bento Info Boxes (Matches Reference 4.9/5.0 & Premium Skills Boxes) */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left Bento Box */}
                <div className="rounded-[20px] bg-[#F7F7F3] p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-1 text-brand-orange mb-3">
                    <Star className="w-4 h-4 fill-brand-orange" />
                    <Star className="w-4 h-4 fill-brand-orange" />
                    <Star className="w-4 h-4 fill-brand-orange" />
                    <Star className="w-4 h-4 fill-brand-orange" />
                    <Star className="w-4 h-4 fill-brand-orange" />
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-brand-navy">
                    4 Phases{' '}
                    <span className="text-sm font-semibold text-brand-muted">
                      / 5-Yr Plan
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-brand-body mt-3">
                    Structured Strategic Growth Roadmap
                  </div>
                </div>

                {/* Right Bento Box: Core Capabilities Pill Tags */}
                <div className="rounded-[20px] bg-[#F7F7F3] p-6">
                  <div className="font-heading text-sm font-bold text-brand-navy mb-3.5">
                    Core Focus Areas
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'VET MEDICINES',
                      'VACCINES',
                      'FEED PREMIXES',
                      'HORMONES',
                      'HATCHING EGGS',
                      'IMPORT & EXPORT',
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white text-[10px] font-heading font-bold uppercase tracking-wider text-brand-navy shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. "OUR BUSINESS DIVISIONS" — COMPACT MODERN BENTO STRIP
      ===================================================================== */}
      <section className="py-16 lg:py-20 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-border text-xs font-bold text-brand-navy mb-3">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Our Business Divisions</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy leading-tight tracking-tight">
                Veterinary &amp; poultry supply divisions
              </h2>
            </div>

            <SplitPillButton
              href="/products"
              label="Browse All Divisions"
              variant="light"
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPANY_PROFILE.businessAreas.map((area, index) => {
              const IconComp = BUSINESS_ICON_MAP[area.iconName] || Pill;
              const isPlanned = area.status.includes('Planned');

              return (
                <Link
                  key={area.id}
                  href={area.href}
                  className={`group rounded-[20px] p-5 flex items-center justify-between gap-4 transition-all duration-200 ${
                    isPlanned
                      ? 'bg-[#0B0E29] text-white hover:bg-[#131842]'
                      : 'bg-white text-brand-navy hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                        isPlanned
                          ? 'bg-brand-orange text-brand-navy'
                          : index % 2 === 1
                          ? 'bg-brand-orange/15 text-brand-navy group-hover:bg-brand-orange'
                          : 'bg-[#F7F7F3] text-brand-navy group-hover:bg-brand-orange'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-heading text-base font-bold truncate ${
                            isPlanned ? 'text-white' : 'text-brand-navy'
                          }`}
                        >
                          {area.title}
                        </h3>
                        {isPlanned && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-brand-orange text-brand-navy shrink-0">
                            Planned
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-0.5 line-clamp-1 ${
                          isPlanned ? 'text-white/70' : 'text-brand-muted'
                        }`}
                      >
                        {area.subtitle}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      isPlanned
                        ? 'bg-white/10 text-brand-orange'
                        : 'bg-[#F7F7F3] text-brand-navy group-hover:bg-brand-orange'
                    }`}
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. FEATURED PRODUCT CATALOGUE (3 ITEMS ONLY)
      ===================================================================== */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F3] border border-brand-border text-xs font-bold text-brand-navy mb-3">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Product Catalogue</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy leading-[1.15] tracking-tight">
                Featured veterinary &amp; poultry products
              </h2>
            </div>

            <SplitPillButton
              href="/products"
              label="Explore Full Catalogue"
              variant="dark"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. STRATEGIC ROADMAP (PHASES 1–4)
      ===================================================================== */}
      <section className="py-16 lg:py-24 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-border text-xs font-bold text-brand-navy mb-4">
                  <Clock className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Strategic Roadmap</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy leading-[1.15]">
                  Four-phase growth strategy
                </h2>
                <p className="text-sm text-brand-body mt-2">
                  {STRATEGY_FRAMEWORK_DISCLAIMER}
                </p>
              </div>
              <SplitPillButton
                href="/about/strategy"
                label="Full Strategy Details"
                variant="light"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STRATEGY_PHASES.map((phase, idx) => (
                <div
                  key={phase.phaseNumber}
                  className={`rounded-[24px] p-7 flex flex-col justify-between shadow-sm ${
                    idx === 1
                      ? 'bg-brand-orange text-brand-navy'
                      : idx === 3
                      ? 'bg-[#0B0E29] text-white'
                      : 'bg-white text-brand-navy'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`text-xs font-heading font-bold px-3 py-1 rounded-full ${
                          idx === 1
                            ? 'bg-brand-navy text-white'
                            : idx === 3
                            ? 'bg-brand-orange text-brand-navy'
                            : 'bg-[#F7F7F3] text-brand-navy'
                        }`}
                      >
                        Phase {phase.phaseNumber}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          idx === 3 ? 'text-brand-orange' : 'opacity-75'
                        }`}
                      >
                        {phase.timeframe}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold">
                      {phase.title}
                    </h3>
                    <p
                      className={`text-xs mt-2 leading-relaxed ${
                        idx === 3 ? 'text-white/80' : 'opacity-85'
                      }`}
                    >
                      {phase.summary}
                    </p>
                    <ul
                      className={`mt-4 pt-4 border-t space-y-2 ${
                        idx === 1
                          ? 'border-brand-navy/15'
                          : idx === 3
                          ? 'border-white/15'
                          : 'border-brand-border'
                      }`}
                    >
                      {phase.milestones.slice(0, 3).map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              idx === 1 ? 'text-brand-navy' : 'text-brand-orange'
                            }`}
                          />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. EXECUTIVE LEADERSHIP TEAM PREVIEW
      ===================================================================== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F3] border border-brand-border text-xs font-bold text-brand-navy mb-4">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Executive Leadership</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy leading-[1.15]">
                Guided by veterinary &amp; trade specialists
              </h2>
            </div>
            <SplitPillButton
              href="/about/leadership"
              label="Meet Our Leadership"
              variant="light"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {teamMembers.map((leader) => (
              <Link
                key={leader.id}
                href="/about/leadership"
                className="group bg-[#FAF9F5] rounded-[20px] border border-brand-border/70 p-3.5 hover:bg-white hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-44 w-full rounded-[14px] bg-[#0B0E29] overflow-hidden mb-3.5">
                  {leader.portraitUrl && (
                    <Image
                      key={leader.portraitUrl}
                      src={leader.portraitUrl}
                      alt={leader.displayName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  )}
                </div>
                <div className="px-1">
                  <h3 className="font-heading text-[15px] font-extrabold text-brand-navy group-hover:text-brand-orange transition-colors">
                    {leader.displayName}
                  </h3>
                  <div className="text-xs font-bold text-brand-goldDark mt-0.5">
                    {leader.roleTitle}
                  </div>
                  <p className="text-xs text-brand-muted mt-2 line-clamp-2 leading-relaxed">
                    {leader.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. GLOBAL PARTNERSHIP & BUSINESS INQUIRY CALLOUT
      ===================================================================== */}
      <section className="pb-20 lg:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-[#0B0E29] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold text-brand-orange">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Global Trade &amp; Distribution Partnerships</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Partner with Lijemrakel Trading PLC for veterinary &amp; poultry solutions
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
                  Whether you are an international manufacturer seeking a trusted representative in Ethiopia or a farm, clinic, or distributor inquiring about product supply, our team is ready to assist.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-4">
                <SplitPillButton
                  href="/contact?type=product-inquiry"
                  label="Inquire About Products"
                  variant="dark"
                />
                <SplitPillButton
                  href="/contact?type=supplier-partnership"
                  label="Supplier Partnership"
                  variant="light"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
