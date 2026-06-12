import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const business = JSON.parse(fs.readFileSync(path.join(root, 'data/business.json'), 'utf8'));
const pagesSeo = JSON.parse(fs.readFileSync(path.join(root, 'data/pages-seo.json'), 'utf8'));

function stripLdJson(html) {
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');
}

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractFaqs(html) {
  const faqs = [];
  const listMatch = html.match(/<div class="faq-list">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/);
  if (!listMatch) return faqs;

  const itemRegex =
    /<div class="faq-item">\s*<button class="faq-question">([\s\S]*?)<\/button>\s*<div class="faq-answer">\s*<p>([\s\S]*?)<\/p>\s*<\/div>\s*<\/div>/g;
  let match;

  while ((match = itemRegex.exec(listMatch[1])) !== null) {
    faqs.push({
      question: stripHtml(match[1].replace(/<span class="faq-icon">[\s\S]*?<\/span>/, '')),
      answer: stripHtml(match[2]),
    });
  }

  return faqs;
}

function localBusinessSchema(pageUrl) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': `${business.url}/#business`,
    name: business.name,
    description:
      'Professional water damage restoration, flood cleanup, and emergency water extraction serving New Castle PA and Lawrence County.',
    url: business.url,
    image: `${business.url}/logo.webp`,
    logo: `${business.url}/logo.webp`,
    telephone: business.telephone,
    openingHours: business.openingHours,
    priceRange: business.priceRange,
    sameAs: business.sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: business.areaServed.map((area) => ({
      '@type': 'City',
      name: area.name,
      containedInPlace: { '@type': 'State', name: area.region },
    })),
    serviceType: business.serviceTypes,
  };

  if (pageUrl === '/') {
    schema['@id'] = business.url + '/';
  }

  return schema;
}

function serviceSchema(page, pageUrl) {
  const areaServed = page.city
    ? {
        '@type': 'City',
        name: page.city,
        containedInPlace: { '@type': 'State', name: 'Pennsylvania' },
      }
    : {
        '@type': 'City',
        name: 'New Castle',
        containedInPlace: { '@type': 'State', name: 'Pennsylvania' },
      };

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.serviceName || page.title,
    description: page.description,
    url: `${business.url}${pageUrl}`,
    provider: { '@id': `${business.url}/#business` },
    areaServed,
    serviceType: page.type === 'service' ? page.serviceName : 'Water Damage Restoration',
  };
}

function breadcrumbSchema(page) {
  if (!page.breadcrumb || page.breadcrumb.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: page.breadcrumb.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${business.url}${crumb.path === '/' ? '/' : crumb.path}`,
    })),
  };
}

function aboutPageSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About New Castle PA Water Damage Restoration',
    url: `${business.url}${page.path}`,
    description: page.description,
    mainEntity: { '@id': `${business.url}/#business` },
  };
}

function faqSchema(faqs) {
  if (!faqs.length) return null;

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

function buildSchemas(html, relativePath) {
  const page = pagesSeo[relativePath];
  if (!page || page.type === 'error') return [];

  const schemas = [localBusinessSchema(page.path)];
  const faqs = extractFaqs(html);

  if (page.type === 'location' || page.type === 'service') {
    schemas.push(serviceSchema(page, page.path));
    const breadcrumbs = breadcrumbSchema(page);
    if (breadcrumbs) schemas.push(breadcrumbs);
  }

  if (page.type === 'home') {
    const breadcrumbs = breadcrumbSchema(page);
    if (breadcrumbs) schemas.push(breadcrumbs);
  }

  if (page.type === 'about') {
    schemas.push(aboutPageSchema(page));
    const breadcrumbs = breadcrumbSchema(page);
    if (breadcrumbs) schemas.push(breadcrumbs);
  }

  const faq = faqSchema(faqs);
  if (faq) schemas.push(faq);

  return schemas;
}

function injectSchemas(html, schemas) {
  if (!schemas.length) return html;
  const blocks = schemas
    .map((schema) => `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`)
    .join('\n  ');
  return html.replace('</head>', `  ${blocks}\n</head>`);
}

function resolvePageKey(filename) {
  const relative = path.relative(root, filename).replace(/\\/g, '/');
  return relative;
}

export function seoSchemaPlugin() {
  return {
    name: 'seo-schema',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const pageKey = resolvePageKey(ctx.filename);
        if (!pagesSeo[pageKey]) return html;

        const schemas = buildSchemas(html, pageKey);
        return injectSchemas(stripLdJson(html), schemas);
      },
    },
  };
}

export { business, pagesSeo };
