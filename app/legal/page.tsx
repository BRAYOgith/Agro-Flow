'use client';

import React from 'react';
import Link from 'next/link';
import { LegalLayout } from '@/src/components/LegalLayout';

export default function LegalHubPage() {
  const policies = [
    {
      title: 'Master Terms of Service & Software License',
      href: '/terms',
      icon: 'contract',
      statutes: 'Law of Contract Act (Cap. 23) • Kenya Copyright Act',
      desc: 'Defines the operational relationship between AgroFlow and agrovet operators. Guarantees 100% store ownership of sales/customer data, fair service level uptime, non-predatory termination with 30-day export rights, and balanced dispute arbitration.',
      audience: 'Agrovet Owners, Branch Managers, Cashiers, Software Licensors',
    },
    {
      title: 'Privacy & Personal Data Protection Policy',
      href: '/privacy',
      icon: 'shield',
      statutes: 'Kenya Data Protection Act, 2019 (KDPA) • ODPC Guidelines',
      desc: 'Formulates transparent data handling rules. Details Agrovet role as Data Controller and AgroFlow as Data Processor. Protects farmer KYC records (National ID, Phone), cashier audit logs, data minimization, encryption, and statutory subject access rights.',
      audience: 'Smallholder Farmers, Agrovet Personnel, Data Protection Officer',
    },
    {
      title: 'Smallholder Fair Credit & Debt Recovery Policy',
      href: '/credit-policy',
      icon: 'account_balance_wallet',
      statutes: 'Consumer Protection Act, 2012 • Co-operative Societies Act (Cap. 490)',
      desc: 'Guarantees smallholder fairness by prohibiting compound interest, hidden fees, and unlawful harassment. Protects agrovet recovery through formal 14-day notice, cooperative check-off guarantees, itemized ledgers, and mutual reconciliation rights.',
      audience: 'Smallholders, Agrovet Operators, Agricultural Cooperatives, Guarantors',
    },
    {
      title: 'PCPB & KEPHIS Agrochemical Dispensation Policy',
      href: '/regulatory',
      icon: 'science',
      statutes: 'Pest Control Products Act (Cap. 346) • Seeds and Plant Varieties Act (Cap. 326)',
      desc: 'Ensures statutory compliance with the Pest Control Products Board (PCPB) and KEPHIS. Regulates batch tracking, FEFO dispensation, safety intervals (PHI/REI), manufacturer recall protocols, and advisory calculation disclaimers.',
      audience: 'Agrochemical Suppliers, Agrovets, Regulators, Farmers',
    },
    {
      title: 'M-Pesa & Digital Payment Settlement Policy',
      href: '/payments-policy',
      icon: 'payments',
      statutes: 'National Payment System Act (Cap. 491B) • Central Bank of Kenya Guidelines',
      desc: 'Governs Safaricom Daraja STK push and C2B/B2B mobile payments. Details delayed network callback reconciliation, transaction reversals, overpayment handling, and cashier shift drawer balancing.',
      audience: 'Till Operators, Customers Paying via M-Pesa, Financial Auditors',
    },
  ];

  return (
    <LegalLayout
      title="AgroFlow Regulatory & Legal Compliance Hub"
      subtitle="Comprehensive statutory and commercial agreements governing AgroFlow platform operations, smallholder credit relations, agrochemical dispensation, data privacy, and digital payment settlements across the Republic of Kenya."
      effectiveDate="September 6, 2026"
      version="2026.2-FINAL"
      activeDoc="legal"
    >
      {/* Intro Box */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 sm:p-5 space-y-2">
        <h3 className="font-playfair font-bold text-sm sm:text-base text-[#003b1b] flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-800">balance</span>
          Fair Commercial & Statutory Standards
        </h3>
        <p className="text-xs text-emerald-950 leading-relaxed">
          AgroFlow operates at the intersection of commercial technology, agricultural input distribution, smallholder rural finance, and telecommunications. In accordance with Article 46 of the Constitution of Kenya (Consumer Rights) and relevant Acts of Parliament, our legal framework is structured to protect all parties impartially: preventing unconscionable conduct while ensuring financial and operational sustainability.
        </p>
      </div>

      {/* Directory Grid */}
      <div className="space-y-4 pt-2">
        <h2 className="font-playfair font-bold text-lg text-[#131b2e]">
          Index of Formal Legal Policies
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {policies.map((p, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#faf8ff] rounded-xl border border-[#dae2fd] hover:border-[#003b1b] transition-all hover:shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-xl text-[#003b1b] bg-white p-2 rounded-lg border border-gray-200 shadow-2xs">
                    {p.icon}
                  </span>
                  <div>
                    <h3 className="font-playfair font-bold text-base text-[#131b2e]">
                      {p.title}
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-800">
                      Governing Laws: {p.statutes}
                    </span>
                  </div>
                </div>

                <Link
                  href={p.href}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#003b1b] hover:bg-[#14532d] text-[#b1f2be] text-xs font-bold rounded-lg transition-colors shrink-0"
                >
                  <span>Review Policy</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {p.desc}
              </p>

              <div className="text-[11px] text-gray-500 bg-white p-2.5 rounded-lg border border-gray-200/60 flex items-center gap-2">
                <span className="font-semibold text-gray-700">Parties Covered:</span>
                <span>{p.audience}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Inquiries and Regulatory Contacts */}
      <div className="pt-4 border-t border-gray-200 space-y-3">
        <h3 className="font-playfair font-bold text-base text-[#131b2e]">
          Regulatory & Compliance Contacts
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-600">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <strong className="block text-gray-800">Data Protection Officer (DPO)</strong>
            <div>AgroFlow Legal Office, Kerugoya Hub</div>
            <div>Email: <span className="font-mono text-emerald-800">privacy@agroflow.co.ke</span></div>
            <div>Pursuant to KDPA Section 24 Registration</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <strong className="block text-gray-800">Agrochemical & Seed Compliance</strong>
            <div>PCPB & KEPHIS Liaison Officer</div>
            <div>Email: <span className="font-mono text-emerald-800">regulatory@agroflow.co.ke</span></div>
            <div>Pest Control Products Board Inspection Desk</div>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}
