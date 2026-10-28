import React from 'react';
import Link from 'next/link';
import { ChevronsRight } from 'lucide-react';

interface SplitPillButtonProps {
  href: string;
  label: string;
  variant?: 'dark' | 'light' | 'navy';
  className?: string;
}

/**
 * Signature dual-tone split pill button matching the reference design:
 * An outer pill in vibrant brand accent (#F7941D) wrapping an inner pill
 * (dark navy or crisp white) with a double-chevron icon on the right.
 */
export function SplitPillButton({
  href,
  label,
  variant = 'dark',
  className = '',
}: SplitPillButtonProps) {
  if (variant === 'light') {
    return (
      <Link
        href={href}
        className={`group inline-flex items-center rounded-full bg-brand-orange p-1 pr-3.5 shadow-sm hover:bg-brand-orangeHover transition-all duration-200 whitespace-nowrap ${className}`}
      >
        <span className="px-5 py-2.5 rounded-full bg-white text-brand-navy font-heading font-bold text-xs sm:text-sm tracking-tight transition-transform duration-200 group-hover:translate-x-0.5">
          {label}
        </span>
        <ChevronsRight className="w-4 h-4 text-brand-navy ml-2.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    );
  }

  if (variant === 'navy') {
    return (
      <Link
        href={href}
        className={`group inline-flex items-center rounded-full bg-brand-navy p-1 pr-3.5 shadow-sm hover:bg-brand-navyLight transition-all duration-200 whitespace-nowrap ${className}`}
      >
        <span className="px-5 py-2.5 rounded-full bg-brand-orange text-brand-navy font-heading font-bold text-xs sm:text-sm tracking-tight transition-transform duration-200 group-hover:translate-x-0.5">
          {label}
        </span>
        <ChevronsRight className="w-4 h-4 text-brand-orange ml-2.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`group inline-flex items-center rounded-full bg-brand-orange p-1 pr-3.5 shadow-sm hover:bg-brand-orangeHover transition-all duration-200 whitespace-nowrap ${className}`}
    >
      <span className="px-5 py-2.5 rounded-full bg-brand-navy text-white font-heading font-bold text-xs sm:text-sm tracking-tight transition-transform duration-200 group-hover:translate-x-0.5">
        {label}
      </span>
      <ChevronsRight className="w-4 h-4 text-brand-navy ml-2.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
