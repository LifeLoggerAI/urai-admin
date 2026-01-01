'use client';

import Link from 'next/link';

const AdminNav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/admin/policies">Policy Manager</Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
