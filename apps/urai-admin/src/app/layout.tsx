import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'URAI Admin | Secure admin OS for AI products',
  description: 'URAI Admin is a standalone operations console for AI apps, Firebase products, feature flags, jobs, audit logs, and internal teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
