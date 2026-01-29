'use client';

import useSWR from 'swr';
import { DataTable } from '@/components/ui/data-table';
import { columns, Job } from './(components)/columns';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function JobsPage() {
  const { data, error } = useSWR<Job[]>('/api/jobs', fetcher);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
