import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://uraianalytics.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'URAI Analytics | Privacy-aware analytics for passive intelligence systems',
    template: '%s | URAI Analytics'
  },
  description: 'URAI Analytics is a privacy-aware analytics command center for product behavior, passive intelligence systems, AI insight usage, reports, exports, and enterprise-ready analytics.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'URAI Analytics',
    description: 'Privacy-aware analytics for passive intelligence systems.',
    url: siteUrl,
    siteName: 'URAI Analytics',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
