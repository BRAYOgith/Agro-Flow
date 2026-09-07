import React from 'react';
import {
  DEFAULT_BASE_URL,
  buildBreadcrumbs,
  buildGraphSchema,
  buildAgroFlowGraph,
} from '@/lib/structured-data';

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Generic component for injecting JSON-LD scripts server-rendered into the HTML document.
 */
export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? buildGraphSchema(data) : data;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload),
      }}
    />
  );
}

/**
 * Global AgroFlow structured data script bundling Organization, WebSite,
 * SoftwareApplication, and FAQPage into a single @graph block.
 */
export function AgroFlowGlobalStructuredData({ baseUrl = DEFAULT_BASE_URL }: { baseUrl?: string }) {
  const graph = buildAgroFlowGraph(baseUrl);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph),
      }}
    />
  );
}

/**
 * Component for injecting BreadcrumbList structured data on subpages.
 */
export function BreadcrumbStructuredData({
  crumbs,
  baseUrl = DEFAULT_BASE_URL,
}: {
  crumbs: { name: string; path?: string }[];
  baseUrl?: string;
}) {
  const breadcrumbData = buildBreadcrumbs(crumbs, baseUrl);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData),
      }}
    />
  );
}
