import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo workspace',
  description: 'Static URAI Analytics fixture workspace for interface verification. Not production telemetry.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function AnalyticsAppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
