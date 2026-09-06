'use client';

import React from 'react';
import { LegalLayout } from '@/src/components/LegalLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy & Personal Data Protection Policy"
      subtitle="Formal policy detailing the lawful, fair, and transparent collection, processing, storage, and safeguarding of personal data pursuant to the Kenya Data Protection Act, 2019 (KDPA)."
      effectiveDate="September 6, 2026"
      version="v2026.2"
      activeDoc="privacy"
    >
      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          1. Statutory Mandate &amp; Applicability
        </h2>
        <p>
          This Privacy Policy is promulgated in strict compliance with the <strong>Kenya Data Protection Act, 2019 (Act No. 24 of 2019)</strong>, the <strong>Data Protection (General) Regulations, 2021</strong>, and guidance circulars issued by the <strong>Office of the Data Protection Commissioner (ODPC)</strong>.
        </p>
        <p>
          This document establishes the binding privacy commitments governing all personal data processed within the AgroFlow Agribusiness Operating System across smallholder farmers, agrovet employees, cooperative guarantors, and enterprise operators throughout the Republic of Kenya.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          2. Clear Legal Distinction of Roles: Controller vs. Processor
        </h2>
        <p>
          Pursuant to Section 2 and Section 24 of the KDPA, the data processing responsibilities are distinguished as follows:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <span className="font-bold text-gray-900 block text-sm">The Agrovet Merchant (Data Controller)</span>
            <p className="text-gray-600 leading-relaxed">
              The licensed agrovet store acts as the <strong>Data Controller</strong>. The merchant determines the purpose of collecting farmer personal data, decides whether to extend input credit, collects farmer consent at the counter, and authorizes transaction records.
            </p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-950 block text-sm">AgroFlow Technologies (Data Processor)</span>
            <p className="text-emerald-900 leading-relaxed">
              AgroFlow acts strictly as the <strong>Data Processor</strong>. We provide the encrypted database architecture, POS algorithms, and cloud synchronization tools. We process personal data solely in accordance with the Controller&apos;s instructions and do not exercise independent control over farmer identities.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          3. Categories of Personal Data Collected
        </h2>
        <p>
          In accordance with the principle of <strong>Data Minimization</strong> (KDPA Section 3(a)), AgroFlow collects only personal data strictly necessary for agrovet counter operations:
        </p>
        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-[#faf8ff] rounded-xl border border-[#dae2fd] space-y-1.5">
            <div className="font-bold text-[#003b1b]">A. Smallholder Farmer Profiles (KYC &amp; Credit Ledger)</div>
            <p className="text-gray-600">
              <strong>Identifying &amp; Contact Details:</strong> Full Name, Kenyan National ID Number, Active Mobile Phone Number, Farm Location / Agricultural Block (e.g., Kerugoya Central, Kutus), and Primary Crops Cultivated.
            </p>
            <p className="text-gray-600">
              <strong>Financial &amp; Co-op Data:</strong> Name of Affiliated Cooperative Society, Co-op Membership Number, Approved Credit Ceiling, Ledger Outstanding Balance, Repayment Dates, and Historical POS Purchase Slips.
            </p>
          </div>

          <div className="p-3.5 bg-[#faf8ff] rounded-xl border border-[#dae2fd] space-y-1.5">
            <div className="font-bold text-[#003b1b]">B. Agrovet Staff &amp; Terminal Operators</div>
            <p className="text-gray-600">
              Employee Full Name, Assigned System Role (Store Manager vs. Cashier), Username, Encrypted Password Hash, Manager PIN, Shift Sign-in/Sign-out Timestamps, and Terminal Cash Drawer Reconciliations.
            </p>
          </div>

          <div className="p-3.5 bg-[#faf8ff] rounded-xl border border-[#dae2fd] space-y-1.5">
            <div className="font-bold text-[#003b1b]">C. Electronic Financial Identifiers</div>
            <p className="text-gray-600">
              Safaricom M-Pesa Transaction Codes (e.g., QK789XYZ12), STK Push Receipt Tokens, Till/Paybill numbers, and timestamped bank deposit slips recorded during physical safe shift closes.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          4. Lawful Grounds for Processing (Section 30 of KDPA)
        </h2>
        <p>
          Personal data within AgroFlow is processed under one or more recognized statutory bases:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li><strong>Performance of Contract:</strong> Necessary to disburse certified farm inputs, process immediate M-Pesa checkouts, and maintain the agrovet revolving credit agreement.</li>
          <li><strong>Compliance with Legal Obligation:</strong> Statutory compliance with the <em>Pest Control Products Act</em> (batch traceability for regulated chemicals) and the <em>Tax Procedures Act</em> (retention of financial transaction vouchers).</li>
          <li><strong>Legitimate Interests:</strong> Protecting the merchant against drawer shortages, credit default, and unauthorized inventory manipulation.</li>
          <li><strong>Consent:</strong> Explicit opt-in consent for automated SMS payment reminders and crop advisory notifications dispatched via mobile networks.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          5. Absolute Prohibition on Data Commercialization
        </h2>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-xs text-red-950 space-y-2">
          <div className="font-bold text-red-900 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">shield_with_heart</span>
            Absolute Ban on Third-Party Data Brokering
          </div>
          <p>
            AgroFlow will <strong>never sell, lease, rent, trade, or share</strong> smallholder farmer databases or merchant sales records to commercial agrochemical manufacturers, marketing agencies, debt aggregators, or speculative investors.
          </p>
          <p>
            Personal data is disclosed strictly to authorized sub-processors required to execute core platform operations: (i) <em>Safaricom PLC</em> for Daraja M-Pesa STK verification, and (ii) licensed telecommunications aggregators (e.g., <em>Africa&apos;s Talking</em>) for SMS receipts and ledger statements requested by the merchant.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          6. Technical &amp; Organizational Security Measures
        </h2>
        <p>
          Pursuant to Section 41 of the KDPA, AgroFlow implements institutional safeguards against accidental loss, unauthorized access, and cyber tampering:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li><strong>Cryptographic Standards:</strong> High-grade AES-256 encryption at rest and TLS 1.3 encryption for all data in transit across web endpoints.</li>
          <li><strong>Zero Plaintext Storage of PINs:</strong> Store Manager PINs and cashier authentication tokens are cryptographically salted and hashed.</li>
          <li><strong>Access Segregation:</strong> Strict least-privilege access; terminal cashiers cannot view store profit margins or export complete regional customer lists.</li>
          <li><strong>Audit Trail Immutability:</strong> All transaction reversals and credit limit modifications generate an indelible, timestamped audit log.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          7. Statutory Rights of Data Subjects (Farmers &amp; Staff)
        </h2>
        <p>
          Under Section 26 of the Kenya Data Protection Act, every registered farmer and store operator enjoys guaranteed rights:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong>Right to Access:</strong> The right to request an itemized paper or electronic statement of their store ledger and purchase history.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong>Right to Rectification:</strong> The right to require immediate correction of misspelled names, updated phone numbers, or erroneous balances.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong>Right to Erasure:</strong> The right to request deletion of KYC profiles upon full liquidation of credit balances (subject to 7-year statutory tax retention rules).
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong>Right to Lodge Complaints:</strong> The right to report data grievances to the Office of the Data Protection Commissioner of Kenya (ODPC).
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          8. 72-Hour Breach Notification Protocol
        </h2>
        <p>
          Pursuant to Section 43 of the KDPA, in the unlikely event of a verified data breach compromising personal identifiers, AgroFlow will:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>Notify the Office of the Data Protection Commissioner within seventy-two (72) hours of becoming aware.</li>
          <li>Notify affected Data Controllers (Merchants) without undue delay with clear mitigation steps.</li>
          <li>Assist merchants in dispatching direct advisories to affected smallholder farmers where there is a risk of financial fraud.</li>
        </ul>
      </section>
    </LegalLayout>
  );
}
