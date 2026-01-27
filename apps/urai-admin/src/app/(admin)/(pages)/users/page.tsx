
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { adminListUsers, adminSetUserRole, adminUpdateUserFlags } from '@/lib/firebase';
import { useAdminAuth, Role } from '@/hooks/useAdminAuth';

// --- Helper Components ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button onClick={onClose} className="w-full btn-secondary mt-4">Close</button>
      </div>
    </div>
  );
};

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value, onChange, debounce]);

    return <input {...props} value={value} onChange={e => setValue(e.target.value)} />;
};

// --- Main User Page Component ---
export default function UsersPage() {
  const { role: adminRole } = useAdminAuth();
  const [users, setUsers] = useImmer([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageTokens, setPageTokens] = useState([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [editingUser, setEditingUser] = useImmer(null);

  const canEditRoles = adminRole === 'superadmin' || adminRole === 'admin';
  const canEditFlags = canEditRoles || adminRole === 'support';

  const fetchUsers = useCallback(async (page) => {
    setLoading(true);
    setError('');
    try {
      const result = await adminListUsers({ pageToken: pageTokens[page], limit: 10 });
      const { users: fetchedUsers, nextPageToken } = result.data as any;
      setUsers(fetchedUsers || []);
      setHasNextPage(!!nextPageToken);
      if (nextPageToken && page === pageTokens.length - 1) {
        setPageTokens(tokens => [...tokens, nextPageToken]);
      }
    } catch (err: any) {
      console.error(err);
      setError(`Failed to fetch users: ${err.message}`);
    }
    setLoading(false);
  }, [pageTokens, setUsers]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const handleRoleChange = async (newRole: Role, reason: string) => {
    if (!editingUser || !canEditRoles) return;
    try {
        await adminSetUserRole({ targetUid: editingUser.uid, newRole, reason });
        setUsers(draft => {
            const user = draft.find(u => u.uid === editingUser.uid);
            if (user) user.role = newRole;
        });
        setEditingUser(null);
    } catch (err: any) {
        console.error(err);
        alert(`Failed to set role: ${err.message}`);
    }
  };
  
  const handleFlagsChange = async (flags: any, reason: string) => {
      if (!editingUser || !canEditFlags) return;
      try {
          await adminUpdateUserFlags({ targetUid: editingUser.uid, flags, reason });
          setUsers(draft => {
              const user = draft.find(u => u.uid === editingUser.uid);
              if (user) {
                  Object.assign(user, flags);
              }
          });
          setEditingUser(null);
      } catch (err: any) {
          console.error(err);
          alert(`Failed to update flags: ${err.message}`);
      }
  };

  const filteredUsers = useMemo(() =>
    (users || []).filter(u => 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.uid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [users, searchQuery]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <DebouncedInput
          placeholder="Search by email, UID, or name..."
          className="w-72"
          onChange={setSearchQuery}
        />
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8">Loading users...</td></tr>
            ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8">No users found.</td></tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.uid}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full mr-4" src={user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`} alt="" />
                        <div>
                            <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400 font-mono">{user.uid}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'superadmin' ? 'bg-red-100 text-red-800' : user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.disabled ? <span className='text-red-600'>Disabled</span> : <span className='text-green-600'>Active</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.creationTime ? new Date(user.creationTime).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {canEditFlags && <button onClick={() => setEditingUser(user)} className="btn-secondary text-xs">Edit</button>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

        <div className="flex justify-between items-center mt-4">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0 || loading} className="btn-secondary">Previous</button>
            <span>Page {currentPage + 1}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={!hasNextPage || loading} className="btn-secondary">Next</button>
        </div>

      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title={`Edit User: ${editingUser?.displayName}`}>
          <div className='space-y-6'>
            {canEditRoles && <RoleEditor user={editingUser} onSave={handleRoleChange} />} 
            {canEditFlags && <FlagEditor user={editingUser} onSave={handleFlagsChange} />}
          </div>
      </Modal>
    </div>
  );
}

function RoleEditor({ user, onSave }) {
    const [newRole, setNewRole] = useState(user.role || 'user');
    const { role: adminRole } = useAdminAuth();

    const handleSave = () => {
        const reason = prompt('Please provide a reason for this role change:');
        if (reason) {
            onSave(newRole, reason);
        }
    };

    return (
        <div className='p-4 border rounded-md space-y-3'>
            <h3 className='font-semibold'>Change Role</h3>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className='w-full'>
                {adminRole === 'superadmin' && <option value="superadmin">Super Admin</option>}
                <option value="admin">Admin</option>
                <option value="support">Support</option>
                <option value="readonly">Read Only</option>
                <option value="user">User (None)</option>
            </select>
            <button onClick={handleSave} className='btn-primary w-full'>Save Role</button>
        </div>
    )
}

function FlagEditor({ user, onSave }) {
    const [flags, setFlags] = useImmer({
        jobsAllowed: user.jobsAllowed ?? true,
        xrAllowed: user.xrAllowed ?? false,
        notificationsAllowed: user.notificationsAllowed ?? true,
    });
    const [cooldown, setCooldown] = useState(user.cooldownUntil ? new Date(user.cooldownUntil).toISOString().split('T')[0] : '');

    const handleSave = () => {
        const reason = prompt('Please provide a reason for changing these flags:');
        const finalFlags = {
            ...flags,
            cooldownUntil: cooldown ? new Date(cooldown).toISOString() : null
        };
        if (reason) {
            onSave(finalFlags, reason);
        }
    };

    return (
        <div className='p-4 border rounded-md space-y-4'>
            <h3 className='font-semibold'>Feature Flags</h3>
            <label className='flex items-center justify-between'><span>Jobs Allowed</span><input type="checkbox" checked={flags.jobsAllowed} onChange={(e) => setFlags(d => {d.jobsAllowed = e.target.checked})} className='h-6 w-6' /></label>
            <label className='flex items-center justify-between'><span>XR Allowed</span><input type="checkbox" checked={flags.xrAllowed} onChange={(e) => setFlags(d => {d.xrAllowed = e.target.checked})} className='h-6 w-6' /></label>
            <label className='flex items-center justify-between'><span>Notifications Allowed</span><input type="checkbox" checked={flags.notificationsAllowed} onChange={(e) => setFlags(d => {d.notificationsAllowed = e.target.checked})} className='h-6 w-6' /></label>
            <label className='block'>
                <span className='text-sm font-medium'>Cooldown Until</span>
                <input type="date" value={cooldown} onChange={e => setCooldown(e.target.value)} className='w-full mt-1' />
            </label>
            <button onClick={handleSave} className='btn-primary w-full'>Save Flags</button>
        </div>
    )
}
