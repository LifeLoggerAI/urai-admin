'use client';
import { useCollection } from 'react-firebase-hooks/firestore';
import { deadLettersCollection } from '@/lib/collections';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
export default function DeadLettersPage() {
    var _a = useCollection(deadLettersCollection), value = _a[0], loading = _a[1], error = _a[2];
    return (<div>
      <DataTable columns={columns} data={(value === null || value === void 0 ? void 0 : value.docs.map(function (doc) { return doc.data(); })) || []} loading={loading} error={error}/>
    </div>);
}
