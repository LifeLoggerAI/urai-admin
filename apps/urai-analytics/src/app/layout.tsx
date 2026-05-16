import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.uraianalytics.com'),
  title: {
    default: 'URAI Analytics | Privacy-aware analytics for passive intelligence systems',
    template: '%s | URAI Analytics'
  },
  description: 'URAI Analytics is a privacy-aware analytics command center for product behavior, passive intelligence systems, AI insight usage, reports, exports, and enterprise-ready analytics.',
  openGraph: {
    title: 'URAI Analytics',
    description: 'Privacy-aware analytics for passive intelligence systems.',
    url: 'https://www.uraianalytics.com',
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
