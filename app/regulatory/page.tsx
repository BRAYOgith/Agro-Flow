'use client';

import React from 'react';
import { LegalLayout } from '@/src/components/LegalLayout';

export default function RegulatoryCompliancePage() {
  return (
    <LegalLayout
      title="Agrochemical Regulatory, PCPB & KEPHIS Dispensation Policy"
      subtitle="Statutory compliance framework governing the registration, batch tracking, First-Expired First-Out (FEFO) dispensation, and safe handling of regulated crop protection chemicals and certified seeds in Kenya."
      effectiveDate="September 6, 2026"
      version="v2026.2"
      activeDoc="regulatory"
    >
      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          1. Statutory Mandate &amp; Regulatory Jurisdiction
        </h2>
        <p>
          The distribution and retail sale of agrochemicals, synthetic fertilizers, fungicides, insecticides, and certified hybrid seeds in Kenya are strictly regulated under national statutes:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li><strong>Pest Control Products Act (Cap. 346):</strong> Governing the registration, labeling, storage, and dispensation of pesticides administered by the <strong>Pest Control Products Board (PCPB)</strong>.</li>
          <li><strong>Seeds and Plant Varieties Act (Cap. 326):</strong> Governing certified seed inspection, germination standards, and labeling administered by the <strong>Kenya Plant Health Inspectorate Service (KEPHIS)</strong>.</li>
          <li><strong>Fertilizers and Animal Foodstuffs Act (Cap. 345):</strong> Regulating nutrient standards, formulation safety, and heavy metal limits.</li>
          <li><strong>Environmental Management and Co-ordination Act (EMCA, Cap. 387):</strong> Regulating hazardous agrochemical storage and safe chemical container disposal.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          2. Mandatory Obligations of the Agrovet Merchant
        </h2>
        <p>
          Every agrovet operating the AgroFlow platform must adhere to the following non-negotiable statutory covenants:
        </p>
        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 bg-[#faf8ff] rounded-xl border border-[#dae2fd] space-y-1">
            <span className="font-bold text-[#003b1b] block">A. Absolute Prohibition on Counterfeit &amp; Unregistered Inputs</span>
            <p className="text-gray-600">
              Only agrochemicals carrying an active, verifiable registration number issued by the PCPB (e.g., <em>PCPB(CR)0482</em>) shall be entered into the store inventory. The sale of un-labeled, gray-market, or counterfeit inputs constitutes a statutory criminal offense and an immediate ground for system termination.
            </p>
          </div>

          <div className="p-3.5 bg-[#faf8ff] rounded-xl border border-[#dae2fd] space-y-1">
            <span className="font-bold text-[#003b1b] block">B. Strict Seed Certification (No Open-Scooping)</span>
            <p className="text-gray-600">
              Certified hybrid crop seeds (e.g., hybrid maize, certified tomato cultivars) must be dispensed strictly in their original, sealed, tamper-evident breeder packaging bearing genuine <strong>KEPHIS verification stickers</strong>. Opening, decanting, mixing, or &quot;scooping&quot; certified seed packets is strictly prohibited under the Seeds and Plant Varieties Act.
            </p>
          </div>

          <div className="p-3.5 bg-[#faf8ff] rounded-xl border border-[#dae2fd] space-y-1">
            <span className="font-bold text-[#003b1b] block">C. First-Expired, First-Out (FEFO) Batch Mandate</span>
            <p className="text-gray-600">
              Agrovets must utilize AgroFlow&apos;s automated FEFO batch engine to prioritize the oldest non-expired batches for counter checkout. Dispensing chemicals past their statutory manufacturer expiry date is unlawful, as active chemical degradation can cause crop phytotoxicity or control failure.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          3. Technical Advisory &amp; Tank-Mixing Matrix Disclaimer
        </h2>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">warning</span>
            Critical Statutory Software Disclaimer: Physical Label Takes Absolute Precedence
          </div>
          <p>
            AgroFlow provides standardized crop input guidelines, 20L knapsack tank mixing ratios, and phenological recommendations as technical decision-support tools derived from manufacturer technical datasheets.
          </p>
          <p>
            (a) <strong>Physical Label Precedence:</strong> Under Kenyan law, the official manufacturer label physically affixed to the bottle or sachet is the sole legal document governing dosage, tank-mix compatibility, target pests, and antidote directions.
          </p>
          <p>
            (b) <strong>Farmer Duty of Care:</strong> The farmer must read the physical product label, strictly observe <strong>Pre-Harvest Intervals (PHI)</strong> and <strong>Re-Entry Intervals (REI)</strong>, and utilize adequate Personal Protective Equipment (PPE) including chemical-resistant gloves, eye protection, and respirators during mixing and field spraying.
          </p>
          <p>
            (c) <strong>Exclusion of Crop Yield Guarantees:</strong> AgroFlow does not warrant crop yield outcomes, as agricultural performance depends on external natural variables beyond software control (including rainfall patterns, soil structure, spray water pH, and pest resistance).
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          4. Defective Batches, Recalls &amp; Supplier Liability
        </h2>
        <p>
          Where an authorized chemical manufacturer or the PCPB declares a batch recall due to formulation contamination, packaging leaks, or active degradation:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <strong>Immediate Batch Freeze:</strong> The agrovet must immediately lock the affected batch number in the AgroFlow inventory screen to prevent further counter checkout.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <strong>Farmer Exchange / Credit:</strong> Any smallholder who purchased products from a verified recalled batch is legally entitled to a full replacement or ledger credit upon returning the unused container.
          </div>
        </div>
        <p className="text-xs text-gray-600 pt-1">
          <strong>Supplier Indemnification:</strong> In accordance with the <em>Consumer Protection Act, 2012</em>, where an agrovet has stored products in strict compliance with temperature and humidity requirements, the primary manufacturer or licensed distributor bears statutory product liability for inherent manufacturing defects or chemical formulation errors.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          5. Environmental Safety &amp; Triple-Rinsing Standards
        </h2>
        <p className="text-xs text-gray-700 leading-relaxed">
          Pursuant to EMCA regulations, agrovets must advise smallholders at checkout regarding safe chemical disposal: Empty pesticide containers must undergo the standard <strong>triple-rinsing protocol</strong>, punctured to prevent reuse for domestic food or water storage, and returned to designated collection hubs for safe destruction.
        </p>
      </section>
    </LegalLayout>
  );
}
