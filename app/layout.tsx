import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AgroFlowGlobalStructuredData } from '@/src/components/StructuredData';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://agroflow.co.ke'),
  title: {
    default: 'AgroFlow - Agribusiness Operating System',
    template: '%s | AgroFlow Agri-OS',
  },
  description:
    'AgroFlow Agri-OS enterprise operations cockpit, POS counter, inventory batch management, and farmer credit ledger for East African agrovets.',
  applicationName: 'AgroFlow Agri-OS',
  keywords: [
    'AgroFlow',
    'Agribusiness Operating System',
    'Agrovet POS',
    'Kenya Agrovet software',
    'Farmer credit ledger',
    'Batch inventory tracking',
    'M-Pesa Daraja POS',
  ],
  authors: [{ name: 'AgroFlow Engineering' }],
  creator: 'AgroFlow Agri-OS Ltd',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://agroflow.co.ke',
    siteName: 'AgroFlow Agri-OS',
    title: 'AgroFlow - Agribusiness Operating System',
    description:
      'Cloud & edge-ready operations cockpit, POS counter, FEFO inventory tracking, and farmer credit ledger for East African agrovets.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Preload critical LCP Hero Image with high priority off the network */}
        <link
          rel="preload"
          as="image"
          href="/media/farmer.jpg"
          // @ts-ignore
          fetchPriority="high"
        />
        {/* Non-blocking icon fonts with fallback swap */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#faf8ff] text-[#131b2e] antialiased min-h-screen font-sans">
        <AgroFlowGlobalStructuredData />
        {children}
      </body>
    </html>
  );
}
