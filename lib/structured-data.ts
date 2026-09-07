/**
 * Structured Data (JSON-LD) generator utilities for AgroFlow.
 * Complies with Schema.org standards and Google Rich Results guidelines.
 */

export const DEFAULT_BASE_URL = 'https://agroflow.co.ke';

/**
 * Builds an Organization schema for AgroFlow Agri-OS.
 */
export function buildOrganizationSchema(baseUrl: string = DEFAULT_BASE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'AgroFlow',
    legalName: 'AgroFlow Agri-OS Ltd',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/media/agroflow-logo.png`,
      width: '512',
      height: '512',
    },
    description:
      'Enterprise agribusiness operating system, POS counter, batch inventory tracking, and farmer credit ledger for East African agrovets and rural cooperatives.',
    email: 'compliance@agroflow.co.ke',
    telephone: '+254-700-000000',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kerugoya Central Hub, Commercial Street',
      addressLocality: 'Kerugoya',
      addressRegion: 'Kirinyaga County',
      postalCode: '10300',
      addressCountry: 'KE',
    },
    areaServed: ['KE', 'UG', 'TZ', 'RW'],
    sameAs: [
      'https://twitter.com/AgroFlowOS',
      'https://www.linkedin.com/company/agroflow-os',
      'https://github.com/agroflow-os',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'technical support & sales',
      telephone: '+254-700-000000',
      email: 'support@agroflow.co.ke',
      areaServed: 'East Africa',
      availableLanguage: ['English', 'Swahili'],
    },
  };
}

/**
 * Builds a WebSite schema for AgroFlow with site search capability.
 */
export function buildWebSiteSchema(baseUrl: string = DEFAULT_BASE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: 'AgroFlow - Agribusiness Operating System',
    url: baseUrl,
    description:
      'AgroFlow Agri-OS enterprise operations cockpit, POS counter, inventory batch management, and farmer credit ledger.',
    inLanguage: 'en-KE',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Builds a SoftwareApplication schema for AgroFlow SaaS platform.
 */
export function buildSoftwareApplicationSchema(baseUrl: string = DEFAULT_BASE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${baseUrl}/#software`,
    name: 'AgroFlow Agri-OS',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, POS Terminal, Android',
    description:
      'Cloud and edge-first agribusiness operations cockpit: POS cashier terminal, FEFO inventory batch tracking, M-Pesa Daraja settlement, and farmer credit ledger.',
    url: baseUrl,
    author: {
      '@id': `${baseUrl}/#organization`,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KES',
      priceValidUntil: '2028-12-31',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'POS Counter with Quick Cash / M-Pesa Daraja Checkout',
      'Batch-level FEFO Inventory & Expiry Tracking',
      'Smallholder Credit Book & SMS Repayment Alerts',
      'Agronomic Crop Advisory & Dosage Calculations',
      'Shift Register Reconciliation & Till Drawer Audit',
    ],
  };
}

/**
 * Builds a BreadcrumbList schema conforming to Google Rich Results guidelines.
 * Omit path on the last item to designate current page.
 */
export function buildBreadcrumbs(
  crumbs: { name: string; path?: string }[],
  baseUrl: string = DEFAULT_BASE_URL
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => {
      const item: { '@type': string; position: number; name: string; item?: string } = {
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
      };
      if (crumb.path) {
        item.item = crumb.path.startsWith('http') ? crumb.path : `${baseUrl}${crumb.path}`;
      }
      return item;
    }),
  };
}

/**
 * Builds an FAQPage schema for pages containing question & answer accordions.
 */
export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Frequently asked operational questions for AgroFlow Agri-OS.
 */
export const AGROFLOW_FAQS = [
  {
    question: 'What happens if the internet connection drops during an agrovet sale?',
    answer:
      'AgroFlow runs on a local SQLite database engine. You can continue scanning barcodes, completing cash sales, and checking stock offline. When connectivity resumes, cloud synchronization and SMS dispatches queue automatically.',
  },
  {
    question: 'How are farmer credit limits enforced at the POS counter?',
    answer:
      'When Credit is selected at checkout, AgroFlow checks the farmer’s outstanding balance against their authorized credit ceiling. If the total exceeds the limit, the cashier cannot proceed without supervisor authorization.',
  },
  {
    question: 'How does Africa’s Talking SMS reminder dispatch work?',
    answer:
      'In the Credit Ledger screen, clicking Send SMS Reminder queues an SMS message containing the farmer’s name, outstanding balance in KES, and agrovet till details directly to their registered Safaricom or Airtel phone number.',
  },
];

/**
 * Bundles multiple schema objects into a single @graph container,
 * stripping nested @context properties.
 */
export function buildGraphSchema(items: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': items.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { '@context': _, ...rest } = item;
      return rest;
    }),
  };
}

/**
 * Builds the complete primary @graph for AgroFlow, including
 * Organization, WebSite, SoftwareApplication, and FAQPage.
 */
export function buildAgroFlowGraph(baseUrl: string = DEFAULT_BASE_URL) {
  const org = buildOrganizationSchema(baseUrl);
  const site = buildWebSiteSchema(baseUrl);
  const software = buildSoftwareApplicationSchema(baseUrl);
  const faq = buildFAQSchema(AGROFLOW_FAQS);

  return buildGraphSchema([org, site, software, faq]);
}

