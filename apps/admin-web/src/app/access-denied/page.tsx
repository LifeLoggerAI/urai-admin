
'use client';

import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <p className="text-lg text-gray-400 mb-8">You do not have the required permissions to view this page.</p>
      <Link href="/admin/dashboard">
        <div className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          Return to Dashboard
        </div>
      </Link>
    </div>
  );
}
