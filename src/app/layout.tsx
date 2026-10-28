import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/layout/SiteShell';

export const metadata: Metadata = {
  title: {
    default:
      'Lijemrakel Trading PLC | Veterinary, Poultry & Agricultural Import-Export Solutions',
    template: '%s | Lijemrakel Trading PLC',
  },
  description:
    'Supporting Ethiopia’s Agriculture Through Reliable Veterinary and Poultry Solutions. Importing veterinary medicines, vaccines, feed premixes, authorized hormones, and fertilized eggs while developing long-term poultry and hatchery capabilities.',
  keywords: [
    'Lijemrakel Trading PLC',
    'Veterinary Medicines Ethiopia',
    'Veterinary Vaccines Ethiopia',
    'Poultry Feed Premixes Ethiopia',
    'Fertilized Hatching Eggs Ethiopia',
    'Livestock Health Import Export Ethiopia',
    'Poultry Production and Hatchery Development',
  ],
  openGraph: {
    title:
      'Lijemrakel Trading PLC — Supporting Ethiopia’s Agriculture Through Reliable Veterinary and Poultry Solutions',
    description:
      'Connecting reputable international manufacturers with Ethiopia’s veterinary, livestock, and poultry markets.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Lijemrakel Trading PLC',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-white text-brand-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-orange focus:text-brand-navy focus:font-bold focus:rounded-md"
        >
          Skip to main content
        </a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
