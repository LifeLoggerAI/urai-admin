import { DataTable } from './(components)/data-table';
import { columns } from './(components)/columns';
import { promises as fs } from 'fs';
import path from 'path';

async function getPolicies() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/(admin)/policies/(data)/policies.json')
  );
  const policies = JSON.parse(data.toString());
  return policies;
}

const PoliciesPage = async () => {
  const policies = await getPolicies();

  return (
    <div>
      <DataTable columns={columns} data={policies} />
    </div>
  );
};

export default PoliciesPage;
