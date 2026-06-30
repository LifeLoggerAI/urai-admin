import type { Metadata } from 'next';
import { LoginClient } from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign in | URAI Admin',
  description: 'Secure Firebase-backed sign in for the URAI Admin command center.',
};

export default function LoginPage() {
  return <LoginClient />;
}
