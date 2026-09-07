'use client';

import React from 'react';
import Link from 'next/link';
import { BreadcrumbStructuredData } from '@/src/components/StructuredData';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  effectiveDate: string;
  version: string;
  activeDoc: 'terms' | 'privacy' | 'credit-policy' | 'regulatory' | 'payments-policy' | 'legal';
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  subtitle,
  effectiveDate,
  version,
  activeDoc,
  children,
}) => {
  const navDocs = [
    { id: 'legal', label: 'Legal Hub Overview', href: '/legal', icon: 'gavel' },
    { id: 'terms', label: 'Terms of Service', href: '/terms', icon: 'contract' },
    { id: 'privacy', label: 'Privacy & Data Protection', href: '/privacy', icon: 'shield' },
    { id: 'credit-policy', label: 'Smallholder Credit Policy', href: '/credit-policy', icon: 'account_balance_wallet' },
    { id: 'regulatory', label: 'PCPB & KEPHIS Regulatory', href: '/regulatory', icon: 'science' },
    { id: 'payments-policy', label: 'M-Pesa & Payment Terms', href: '/payments-policy', icon: 'payments' },
  ];

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Legal & Compliance Hub', path: '/legal' },
    ...(activeDoc !== 'legal' ? [{ name: title }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col antialiased">
      <BreadcrumbStructuredData crumbs={breadcrumbs} />
      <header className="bg-[#003b1b] text-white sticky top-0 z-30 shadow-md border-b border-[#14532d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1X9wFvkPwR2rD-0K7RfG9t5qZ6pueh0C-3t9cT_cBLxyVLB8zYvPOEj74ThuFFBhNzqKYSI--qvIwvubjHuCGbO_Ff2zBPZr4eo-ZohcRjmLH1RzKEgloqef7kc5bNLEBmdk9ZY2F_ILINM8h1jfuz_1mLi90KDf1sp2hMQrgHpKiLLwSjX7p7vbn-9ty5OUpbjAnn9tNRU319WM1-60_sndWDOC1TtuMwQFVZz2p5k4oxssS4PXQ466kom"
                alt="AgroFlow Logo"
                className="w-8 h-8 object-contain bg-white rounded-lg p-1"
              />
              <div>
                <span className="font-playfair font-bold text-lg tracking-tight text-white group-hover:text-[#11bf36] transition-colors">
                  AgroFlow
                </span>
                <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-[#11bf36] ml-2">
                  Legal & Compliance
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-[#14532d] hover:bg-[#1b6b3b] text-gray-200 font-semibold rounded-lg border border-[#14532d] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-[#11bf36]">print</span>
              <span>Print Document</span>
            </button>
            <Link
              href="/"
              className="px-3.5 py-1.5 bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-md"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to App</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="sticky top-20 bg-white rounded-xl border border-[#dae2fd] shadow-xs p-4 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#11bf36] pb-2 border-b border-gray-100">
              Regulatory Instruments
            </div>
            <nav className="space-y-1">
              {navDocs.map((doc) => {
                const isActive = activeDoc === doc.id;
                return (
                  <Link
                    key={doc.id}
                    href={doc.href}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#002410] border-l-4 border-[#11bf36] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-base ${isActive ? 'text-[#11bf36]' : 'text-gray-500'}`}>
                      {doc.icon}
                    </span>
                    <span className="truncate">{doc.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                <span className="material-symbols-outlined text-sm text-[#11bf36]">verified_user</span>
                <span>Kenyan Law Compliance</span>
              </div>
              <p className="text-[10px] leading-relaxed text-gray-600">
                Drafted pursuant to the Data Protection Act (2019), Pest Control Products Act (Cap. 346), Consumer Protection Act (2012), and CBK National Payment System regulations.
              </p>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9">
          <article className="bg-white rounded-2xl border border-[#dae2fd] shadow-xs p-6 sm:p-10 space-y-6">
            <div className="border-b border-gray-200 pb-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                <span>Version: <strong className="font-mono text-gray-800">{version}</strong></span>
                <span>Effective Date: <strong className="text-gray-800">{effectiveDate}</strong></span>
                <span>Jurisdiction: <strong className="text-gray-800">Republic of Kenya</strong></span>
              </div>
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
                {title}
              </h1>
              <span className="w-12 h-1 bg-[#11bf36] rounded-full block"></span>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-6">
              {children}
            </div>

            <div className="border-t border-gray-200 pt-6 mt-8 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                AgroFlow Legal & Compliance Unit • Kerugoya Central Hub, Kirinyaga County, Kenya
              </div>
              <div className="text-gray-400 text-[11px]">
                Official Legal Notice • Fair to All Parties
              </div>
            </div>
          </article>
        </main>
      </div>

      <footer className="bg-[#002b13] text-[#87c695] text-xs py-5 border-t border-[#14532d] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AgroFlow Agribusiness Operating System © 2026. All Rights Reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/credit-policy" className="hover:text-white transition-colors">Credit Policy</Link>
            <Link href="/regulatory" className="hover:text-white transition-colors">PCPB & KEPHIS</Link>
            <Link href="/payments-policy" className="hover:text-white transition-colors">Payment Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
