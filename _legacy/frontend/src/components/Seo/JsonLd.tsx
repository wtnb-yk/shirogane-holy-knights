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

// Article schema for news
interface ArticleSchemaProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  url: string;
  category?: string;
}

export function ArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  author = "だんいんポータル",
  image,
  url,
  category
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://www.noe-room.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "だんいんポータル",
      "url": "https://www.noe-room.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.noe-room.com/favicon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    ...(image && {
      "image": {
        "@type": "ImageObject",
        "url": image,
        "width": 1200,
        "height": 628
      }
    }),
    ...(category && {
      "articleSection": category
    }),
    "inLanguage": "ja-JP"
  };

  return <JsonLd data={schema} />;
}

// Event schema for calendar events
interface EventSchemaProps {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url?: string;
  eventType?: string;
  isOnline?: boolean;
}

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
  eventType,
  isOnline = false
}: EventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "startDate": startDate,
    ...(endDate && { "endDate": endDate }),
    "organizer": {
      "@type": "Organization",
      "name": "白銀ノエル",
      "url": "https://www.youtube.com/@ShiroganeNoel"
    },
    "eventAttendanceMode": isOnline 
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/MixedEventAttendanceMode",
    ...(location && {
      "location": isOnline ? {
        "@type": "VirtualLocation",
        "url": location
      } : {
        "@type": "Place",
        "name": location
      }
    }),
    ...(url && { "url": url }),
    ...(eventType && { "eventStatus": "https://schema.org/EventScheduled" }),
    "inLanguage": "ja-JP"
  };

  return <JsonLd data={schema} />;
}

// VideoObject schema for archive videos
interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  embedUrl: string;
  contentUrl: string;
  viewCount?: number;
}

export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl,
  contentUrl,
  viewCount
}: VideoSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "embedUrl": embedUrl,
    "contentUrl": contentUrl,
    ...(duration && { "duration": duration }),
    ...(viewCount && { "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/WatchAction",
      "userInteractionCount": viewCount
    }}),
    "publisher": {
      "@type": "Organization",
      "name": "だんいんポータル",
      "url": "https://www.noe-room.com"
    },
    "inLanguage": "ja-JP"
  };

  return <JsonLd data={schema} />;
}

// MusicRecording schema for songs
interface MusicSchemaProps {
  name: string;
  byArtist: string;
  originalArtist?: string;
  duration?: string;
  url?: string;
  recordingOf?: string;
}

export function MusicSchema({
  name,
  byArtist,
  originalArtist,
  duration,
  url,
  recordingOf
}: MusicSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": name,
    "byArtist": {
      "@type": "Person",
      "name": byArtist
    },
    ...(originalArtist && originalArtist !== byArtist && {
      "recordingOf": {
        "@type": "MusicComposition",
        "name": recordingOf || name,
        "composer": {
          "@type": "Person",
          "name": originalArtist
        }
      }
    }),
    ...(duration && { "duration": duration }),
    ...(url && { "url": url }),
    "inLanguage": "ja-JP"
  };

  return <JsonLd data={schema} />;
}
