'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { TopUtilityBar } from '@/components/layout/TopUtilityBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrbitAssistant } from '@/components/chat/OrbitAssistant';
import { ThemeProvider } from '@/components/ui/ThemeToggle';
import { PublicCmsProvider, PublicCmsSnapshot } from '@/lib/usePublicCms';

export function SiteShell({
  children,
  initialCms,
}: {
  children: React.ReactNode;
  initialCms?: PublicCmsSnapshot;
}) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith('/admin') || pathname?.startsWith('/adminlogin');

  useEffect(() => {
    if (!pathname || isAdminRoute) return;

    const tz =
      typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : '';
    const locale =
      typeof navigator !== 'undefined' ? navigator.language || '' : '';

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        pageTitle: typeof document !== 'undefined' ? document.title : pathname,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        timezone: tz,
        locale,
      }),
    }).catch(() => {
      // Non-blocking telemetry
    });
  }, [pathname, isAdminRoute]);

  if (isAdminRoute) {
    return (
      <PublicCmsProvider initialData={initialCms}>
        <main id="main-content" className="min-h-screen flex-1 bg-[#F4F5F8]">
          {children}
        </main>
      </PublicCmsProvider>
    );
  }

  return (
    <ThemeProvider>
      <PublicCmsProvider initialData={initialCms}>
        <div className="public-site-shell flex-1 flex flex-col min-h-screen bg-white dark:bg-[#070B1E] transition-colors duration-300">
          <TopUtilityBar />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <OrbitAssistant />
        </div>
      </PublicCmsProvider>
    </ThemeProvider>
  );
}
