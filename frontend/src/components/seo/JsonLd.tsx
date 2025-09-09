interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// WebSite schema
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "だんいんポータル -白銀ノエル非公式ファンサイト-",
    "url": "https://www.noe-room.com",
    "description": "白銀ノエルさんの非公式ファンサイト「だんいんポータル」はホロライブ3期生の白銀ノエル団長を応援する非公式ファンサイトです。最新ニュース、配信アーカイブ、楽曲情報を検索・閲覧できます。",
    "inLanguage": "ja-JP",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.noe-room.com/news?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return <JsonLd data={schema} />;
}

// Organization schema  
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "だんいんポータル -白銀ノエル非公式ファンサイト-",
    "url": "https://www.noe-room.com",
    "description": "白銀ノエルさんの非公式ファンサイト「だんいんポータル」はホロライブ3期生の白銀ノエル団長を応援する非公式ファンサイトです。最新ニュース、配信アーカイブ、楽曲情報を検索・閲覧できます。",
    "sameAs": [
      "https://x.com/ChuunChuuun"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://x.com/ChuunChuuun"
    }
  };

  return <JsonLd data={schema} />;
}

// Breadcrumb schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return <JsonLd data={schema} />;
}
