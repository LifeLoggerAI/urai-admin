'use client';

import { DataTable } from '@/components/ui/data-table';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

import { columns, Job } from './(components)/columns';

const jobSchema = z.object({
  id: z.string(),
  queue: z.string(),
  status: z.enum(['completed', 'failed']),
  retries: z.number(),
});

async function getJobs(): Promise<Job[]> {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/(admin)/jobs/(data)/jobs.json')
  );

  const jobs = JSON.parse(data.toString());

  return z.array(jobSchema).parse(jobs);
}

export default async function JobsPage() {
  const data = await getJobs();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
