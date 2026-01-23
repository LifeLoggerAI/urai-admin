'use client';

import { DataTable } from '@/components/ui/data-table';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

import { columns, FeatureFlag } from './(components)/columns';

const featureFlagSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  rollout: z.number(),
});

async function getFeatureFlags(): Promise<FeatureFlag[]> {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/(admin)/feature-flags/(data)/flags.json')
  );

  const flags = JSON.parse(data.toString());

  return z.array(featureFlagSchema).parse(flags);
}

export default async function FeatureFlagsPage() {
  const data = await getFeatureFlags();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
