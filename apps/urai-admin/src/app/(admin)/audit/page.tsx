'use client';

import { DataTable } from '@/components/ui/data-table';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

import { columns, AuditEvent } from './(components)/columns';

const auditEventSchema = z.object({
  id: z.string(),
  actor: z.string(),
  action: z.string(),
  timestamp: z.string(),
});

async function getAuditEvents(): Promise<AuditEvent[]> {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/(admin)/audit/(data)/events.json')
  );

  const events = JSON.parse(data.toString());

  return z.array(auditEventSchema).parse(events);
}

export default async function AuditPage() {
  const data = await getAuditEvents();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
