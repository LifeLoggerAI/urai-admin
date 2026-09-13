import type { Metadata } from 'next';
const Inter = (options?: unknown) => { void options; return { className: '', variable: '' }; };
import './globals.css';
import './spatial-admin.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'URAI Admin — System-of-systems control plane',
  description: 'URAI Admin is the protected control plane for systems, releases, evidence, workflows, providers, policy, incidents, domains, cost, audit, and governance.',
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
