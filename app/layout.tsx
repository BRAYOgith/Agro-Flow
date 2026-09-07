import type { Metadata } from 'next';
import './globals.css';
import { AgroFlowGlobalStructuredData } from '@/src/components/StructuredData';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;0,900;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#faf8ff] text-[#131b2e] antialiased min-h-screen">
        <AgroFlowGlobalStructuredData />
        {children}
      </body>
    </html>
  );
}
