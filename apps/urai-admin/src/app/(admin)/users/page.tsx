import { DataTable } from './(components)/data-table';
import { columns } from './(components)/columns';
import { promises as fs } from 'fs';
import path from 'path';

async function getUsers() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/(admin)/users/(data)/users.json')
  );
  const users = JSON.parse(data.toString());
  return users;
}

const UsersPage = async () => {
  const users = await getUsers();

  return (
    <div>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UsersPage;
