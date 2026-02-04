'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { jobsCollection } from '@/lib/collections';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export default function JobsPage() {
  const [value, loading, error] = useCollection(jobsCollection);

  return (
    <div>
      <DataTable
        columns={columns}
        data={value?.docs.map((doc) => doc.data()) || []}
        loading={loading}
        error={error}
      />
    </div>
  );
}
