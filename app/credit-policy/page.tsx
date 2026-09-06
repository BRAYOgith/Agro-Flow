'use client';

import React from 'react';
import { LegalLayout } from '@/src/components/LegalLayout';

export default function CreditPolicyPage() {
  return (
    <LegalLayout
      title="Smallholder Fair Credit & Debt Recovery Policy"
      subtitle="The governing legal standard ensuring transparent, non-predatory farm input credit extensions for smallholders while guaranteeing lawful debt recovery mechanisms for agrovet merchants."
      effectiveDate="September 6, 2026"
      version="v2026.2"
      activeDoc="credit-policy"
    >
      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          1. Legislative Purpose &amp; Balanced Framework
        </h2>
        <p>
          Smallholder agricultural credit is the financial lifeblood of Kenyan rural communities, enabling farmers to access certified hybrid seeds, basal fertilizers, and crop protection inputs prior to seasonal harvest.
        </p>
        <p>
          This Policy is formulated pursuant to the <strong>Consumer Protection Act, 2012</strong>, the <strong>Co-operative Societies Act (Cap. 490)</strong>, and the <strong>Law of Contract Act (Cap. 23)</strong>. Its express purpose is to balance the economic survival of smallholders against the financial solvency of community agrovets, eliminating predatory lending while upholding lawful debt recovery.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          2. Smallholder Bill of Rights (Consumer Safeguards)</h2>
        <p>
          Every smallholder farmer accessing farm inputs on credit through an AgroFlow-powered agrovet is entitled to the following statutory and contractual protections:
        </p>
        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-950 block">A. Absolute Ban on Compound Interest &amp; Hidden Levies</span>
            <p className="text-emerald-900 leading-relaxed">
              AgroFlow prohibits predatory compound interest, hidden ledger administration fees, and unauthorized penalty inflation. All credit extensions must clearly state the flat purchase price and any mutually agreed seasonal service fee upfront.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-950 block">B. Mandatory Itemized Checkout Vouchers</span>
            <p className="text-emerald-900 leading-relaxed">
              No credit sale shall be legally enforceable unless the smallholder receives a printed receipt or automated SMS voucher specifying: (i) SKU names and package specs, (ii) exact unit retail prices, (iii) total debit amount, (iv) resulting outstanding balance, and (v) agreed repayment due date.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-950 block">C. 14-Day Mandatory Grace Period &amp; Prior Notice</span>
            <p className="text-emerald-900 leading-relaxed">
              Prior to initiating formal debt recovery or cooperative check-off deductions, the merchant must dispatch at least one formal SMS or written notice giving a minimum of fourteen (14) calendar days to settle or propose a payment schedule.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-950 block">D. Respectful &amp; Dignified Recovery (Anti-Harassment)</span>
            <p className="text-emerald-900 leading-relaxed">
              Debt recovery must be conducted with absolute dignity. The merchant, its staff, and recovery agents are strictly prohibited from: (i) public shaming, (ii) broadcasting debt notices to un-involved third parties, (iii) late-night home harassment, or (iv) unlawful extrajudicial seizure of homestead survival tools.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-950 block">E. 30-Day Ledger Discrepancy Dispute Window</span>
            <p className="text-emerald-900 leading-relaxed">
              Smallholders possess the legal right to challenge any erroneous ledger entry within thirty (30) days of receiving an account statement. The agrovet must produce the physical or digital cashier signature voucher within five (5) business days, failing which the disputed charge shall be stayed pending mutual review.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          3. Agrovet Merchant Protections &amp; Solvency Guarantees
        </h2>
        <p>
          Agrovet merchants bear substantial working capital risk when dispensing certified inputs on revolving terms. The law provides the following enforceable protections:
        </p>
        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1">
            <span className="font-bold text-blue-950 block">A. Legally Enforceable Debt Obligation</span>
            <p className="text-blue-900 leading-relaxed">
              Credit extended at the AgroFlow POS counter constitutes a legally binding contract for goods sold and delivered under the <em>Sale of Goods Act (Cap. 31)</em>. The merchant has full recourse to enforce debt recovery through the Small Claims Court of Kenya.
            </p>
          </div>

          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1">
            <span className="font-bold text-blue-950 block">B. Cooperative Check-Off Tripartite Enforcement</span>
            <p className="text-blue-900 leading-relaxed">
              Where the farmer is registered under an affiliated cooperative society (e.g., Kirinyaga Central Farmers Co-op) and has executed a check-off assignment, the agrovet is legally entitled to submit certified AgroFlow ledger extracts to the cooperative for deduction from seasonal produce payouts (coffee, tea, milk, or horticulture).
            </p>
          </div>

          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1">
            <span className="font-bold text-blue-950 block">C. Immediate Facility Freeze on Overdue Accounts</span>
            <p className="text-blue-900 leading-relaxed">
              If an account exceeds the agreed credit ceiling or remains unsettled sixty (60) days past the agreed harvest maturity date, the merchant has the absolute right to freeze the farmer&apos;s credit account at the POS terminal, restricting the customer to cash-only transactions until the arrears are cleared.
            </p>
          </div>

          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1">
            <span className="font-bold text-blue-950 block">D. Joint &amp; Several Guarantor Liability</span>
            <p className="text-blue-900 leading-relaxed">
              Where a farmer&apos;s credit line was endorsed by a co-farmer or cooperative guarantor, such guarantor shall be jointly and severally liable for outstanding balances once the primary borrower has defaulted past thirty (30) days following formal notice.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          4. Force Majeure, Crop Failure &amp; Debt Restructuring
        </h2>
        <p>
          Kenyan agriculture is vulnerable to extreme climatic events (droughts, hailstorms) and catastrophic pest invasions (e.g., fall armyworm, bacterial wilt):
        </p>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2">
          <p>
            <strong>Good-Faith Restructuring Protocol:</strong> Where a smallholder experiences verifiable severe crop loss verified by a local agricultural extension officer or cooperative management, the agrovet and farmer shall enter into good-faith restructuring:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Extension of the repayment maturity date to the subsequent growing season without punitive default surcharges.</li>
            <li>Mutual agreement on a phased monthly installment plan structured around alternative rural household income.</li>
            <li>Option to settle balances through approved agricultural produce barter where agreed by both parties.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          5. Dispute Conciliation &amp; Judicial Escalation
        </h2>
        <p>
          Any dispute relating to credit ledger calculations, uncredited repayments, or debt recovery shall proceed in progressive phases:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-700">
          <li><strong>Step 1 (Internal Reconciliation):</strong> In-store reconciliation between the farmer and store manager using AgroFlow digital shift receipts and M-Pesa statements within 7 days.</li>
          <li><strong>Step 2 (Cooperative Mediation):</strong> If unresolved, referral to the local Cooperative Supervisory Committee or Ward Agricultural Officer for informal mediation within 14 days.</li>
          <li><strong>Step 3 (Small Claims Court):</strong> If mediation fails, either party may file a claim at the <strong>Small Claims Court of Kenya</strong> having local jurisdiction (e.g., Kerugoya Law Courts) for swift determination within 60 days.</li>
        </ol>
      </section>
    </LegalLayout>
  );
}
