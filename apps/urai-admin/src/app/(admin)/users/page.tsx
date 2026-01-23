import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

import { columns } from './(components)/columns';
import { DataTable } from './(components)/data-table';
import { userSchema } from './(data)/schema';

// Simulate a database read for tasks.
async function getUsers() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'apps/urai-admin/src/app/(admin)/users/(data)/users.json')
  );

  const users = JSON.parse(data.toString());

  return z.array(userSchema).parse(users);
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your users!
            </p>
          </div>
        </div>
        <DataTable data={users} columns={columns} />
      </div>
    </>
  );
}
