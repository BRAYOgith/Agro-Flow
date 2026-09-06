'use client';

import React from 'react';
import { LegalLayout } from '@/src/components/LegalLayout';

export default function PaymentsPolicyPage() {
  return (
    <LegalLayout
      title="M-Pesa & Digital Payment Settlement Policy"
      subtitle="Operational and regulatory guidelines governing mobile money checkout (Safaricom M-Pesa STK Push), split-tender accounting, delayed callback reconciliations, and cash drawer auditing under Central Bank of Kenya regulations."
      effectiveDate="September 6, 2026"
      version="v2026.2"
      activeDoc="payments-policy"
    >
      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          1. Statutory Mandate &amp; Scope
        </h2>
        <p>
          Digital financial services and point-of-sale mobile money checkouts in Kenya operate under the regulatory oversight of the <strong>Central Bank of Kenya (CBK)</strong> pursuant to the <strong>National Payment System Act (Cap. 491B)</strong> and the <strong>National Payment System Regulations, 2014</strong>.
        </p>
        <p>
          This Policy governs all electronic and cash financial flows executed through the AgroFlow platform, including Safaricom M-Pesa Daraja STK Push, Paybill/Buy Goods settlements, cash drawer denominations, and shift Z-reports.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          2. Safaricom M-Pesa STK Push &amp; Counter Checkout Protocols
        </h2>
        <p>
          When an agrovet cashier initiates an M-Pesa payment prompt via AgroFlow:
        </p>
        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-950 block">A. Mandatory Explicit PIN Authorization</span>
            <p className="text-emerald-900 leading-relaxed">
              The STK push triggers a secure pop-up directly on the customer&apos;s handset. Neither AgroFlow nor the agrovet cashier ever sees, prompts for, or records the customer&apos;s personal 4-digit M-Pesa PIN. The transaction is authenticated strictly between the customer&apos;s SIM and Safaricom&apos;s core financial switch.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-950 block">B. Handling Network Latency &amp; Delayed Callbacks</span>
            <p className="text-emerald-900 leading-relaxed">
              In cases of telecommunication delays where the customer is debited by Safaricom but the AgroFlow terminal has not yet received the electronic callback:
            </p>
            <ul className="list-disc pl-5 pt-1 space-y-1 text-emerald-950">
              <li>Cashiers are <strong>strictly prohibited</strong> from forcing the customer to make a second payment without verifying the official Safaricom SMS receipt.</li>
              <li>The cashier can inspect the 10-character alphanumeric transaction code (e.g., <em>QJ4892KM10</em>) presented on the customer&apos;s phone and reconcile it against the pending order reference.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          3. Overpayments, Underpayments &amp; Reversal Procedures
        </h2>
        <p>
          To maintain fairness between customers and merchants:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <strong className="block text-gray-800">Customer Overpayment Refund:</strong>
            <p className="text-gray-600">
              If a customer accidentally transmits an amount exceeding the sales ticket total, the merchant must immediately refund the difference in cash or execute a merchant reversal through Safaricom within twenty-four (24) hours.
            </p>
          </div>
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <strong className="block text-gray-800">Canceled Sale Reversals:</strong>
            <p className="text-gray-600">
              If an STK payment completes successfully but the customer cancels the sale before physical goods leave the agrovet dispensary, the Store Manager must initiate a reversal through the official Safaricom Merchant portal.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          4. Split-Tender Accounting Integrity
        </h2>
        <p>
          AgroFlow supports flexible rural retail payment habits via split-tender settlement (e.g., KES 1,000 in physical cash + KES 1,500 via M-Pesa on a KES 2,500 seed order):
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
          <li>Each payment channel must be itemized distinctly on the customer&apos;s tax voucher.</li>
          <li>In the event of an audit, physical drawer cash and electronic Till receipts must reconcile independently against the shift ledger.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair font-bold text-base sm:text-lg text-[#003b1b] border-b pb-1.5">
          5. End-of-Shift Reconciliation &amp; Manager PIN Audit Trails
        </h2>
        <p>
          Physical cash handling in retail stores is vulnerable to inadvertent cashier shortages or unrecorded disbursements:
        </p>
        <div className="bg-[#faf8ff] p-4 rounded-xl border border-[#dae2fd] text-xs space-y-2">
          <div className="font-bold text-[#003b1b] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">receipt_long</span>
            Shift Close &amp; Physical Safe Reconcile Protocol
          </div>
          <p className="text-gray-700">
            At the close of each cashier shift, the terminal enforces a mandatory physical banknote denomination count (KES 1000, 500, 200, 100, 50 notes and coins).
          </p>
          <p className="text-gray-700">
            Any drawer discrepancy (surplus or shortage) is computed automatically against the system&apos;s digital journal. A verified <strong>Store Manager PIN</strong> is required to lock the register and generate the final Z-Report, creating an indelible legal audit record for enterprise accounting.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
