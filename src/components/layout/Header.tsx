'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { SplitPillButton } from '@/components/ui/SplitPillButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface NavSubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavSubItem[];
}

const NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About Us',
    href: '/about',
    children: [
      { label: 'Company Overview', href: '/about' },
      { label: 'Mission & Vision', href: '/about/mission-vision-values' },
      { label: 'Our Strategy', href: '/about/strategy' },
      { label: 'Leadership', href: '/about/leadership' },
    ],
  },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Veterinary Medicines', href: '/products/veterinary-medicines' },
      { label: 'Vaccines', href: '/products/vaccines' },
      { label: 'Feed Premixes', href: '/products/feed-premixes' },
      { label: 'Hormones', href: '/products/hormones' },
      { label: 'Fertilized Eggs', href: '/products/fertilized-eggs' },
    ],
  },
  {
    label: 'Poultry & Hatchery',
    href: '/poultry-hatchery',
    children: [
      { label: 'Poultry Production', href: '/poultry-hatchery/poultry-production' },
      { label: 'Hatchery Development', href: '/poultry-hatchery/hatchery-development' },
    ],
  },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-200 border-b border-white/10 ${
        isScrolled
          ? 'bg-[#090B24]/95 backdrop-blur-md shadow-lg'
          : 'bg-[#0B0E29]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Official Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group"
            aria-label="Lijemrakel Trading PLC Home"
          >
            <div className="relative h-12 w-14 rounded-xl bg-white p-1 shadow-sm shrink-0">
              <Image
                src="/images/logo/lijemrakel-logo.png"
                alt="Lijemrakel Trading PLC"
                fill
                sizes="56px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-white text-lg tracking-tight leading-none">
                Lijemrakel
              </span>
              <span className="text-[10px] text-brand-orange font-semibold uppercase tracking-widest mt-1">
                Trading PLC
              </span>
            </div>
          </Link>

          {/* Centered Single-Line Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2"
            aria-label="Main Navigation"
          >
            {NAVIGATION_ITEMS.map((item) => {
              const active = isActiveLink(item.href);
              const hasChildren = Boolean(item.children?.length);
              const isOpen = openDropdown === item.label;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-brand-orange font-semibold'
                        : 'text-white/85 hover:text-brand-orange'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`whitespace-nowrap inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-brand-orange font-semibold'
                        : 'text-white/85 hover:text-brand-orange'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-brand-orange' : 'text-white/60'
                      }`}
                    />
                  </Link>

                  {isOpen && (
                    <div className="absolute left-0 top-full pt-2 w-56 z-50">
                      <div className="bg-white rounded-2xl border border-brand-border shadow-xl py-2 overflow-hidden">
                        {item.children?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              pathname === sub.href
                                ? 'bg-[#F7F7F3] text-brand-navy font-bold'
                                : 'text-brand-body hover:bg-[#F7F7F3] hover:text-brand-navy'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Area: Light/Dark Theme Toggle + Split-Pill CTA Button */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <ThemeToggle showLabel />
            <SplitPillButton href="/contact" label="Inquire Now" variant="dark" />
          </div>

          {/* Mobile Theme Toggle + Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-lg text-white hover:bg-white/10 border border-white/15"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0B0E29] px-4 py-5 space-y-1.5 shadow-2xl max-h-[82vh] overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActiveLink(item.href)
                    ? 'bg-brand-orange text-brand-navy'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="pl-4 mt-1 space-y-1 border-l border-white/15 ml-3">
                  {item.children.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-3 py-1.5 text-xs font-medium text-white/75 hover:text-brand-orange"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 border-t border-white/10 flex justify-center">
            <SplitPillButton href="/contact" label="Inquire Now" variant="dark" />
          </div>
        </div>
      )}
    </header>
  );
}
