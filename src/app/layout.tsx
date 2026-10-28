import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SiteShell } from '@/components/layout/SiteShell';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

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
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
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
