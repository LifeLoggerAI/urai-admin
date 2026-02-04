'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { deadLettersCollection } from '@/lib/collections';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export default function DeadLettersPage() {
  const [value, loading, error] = useCollection(deadLettersCollection);

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
