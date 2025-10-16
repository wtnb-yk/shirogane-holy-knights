import { Metadata } from 'next';
import React from "react";

export const metadata: Metadata = {
  title: 'スペシャル | 白銀ノエル非公式ファンサイト',
  description: '当サイトで実施している企画を紹介しています。企画は周年や生誕祭などの記念日に合わせて随時開催予定です！',
  openGraph: {
    title: 'スペシャル | 白銀ノエル非公式ファンサイト',
    description: '当サイトで実施している企画を紹介しています。企画は周年や生誕祭などの記念日に合わせて随時開催予定です！',
    url: 'https://www.noe-room.com/specials',
    siteName: '白銀ノエル非公式ファンサイト',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'スペシャル | 白銀ノエル非公式ファンサイト',
    description: '当サイトで実施している企画を紹介しています。企画は周年や生誕祭などの記念日に合わせて随時開催予定です！',
  },
};

export default function SpecialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
