'use client';

import { useState } from 'react';
import UsersTable from "@/components/users/UsersTable";
import { UserDetailPanel } from '@/components/UserDetailPanel';
import withRole from '@/components/withRole';
import { User } from 'firebase/auth';

// This is a placeholder for the actual user data structure we'll get from Firestore
interface UraiUser extends User {
    customClaims?: {
        role: 'super_admin' | 'admin' | 'analyst' | 'moderator' | 'support' | 'viewer';
    };
    devices?: any[];
    consentTiers?: any;
    featureFlags?: any;
    mentalLoadScores?: any;
    shadowMetrics?: any;
    archetypeState?: any;
    timelineHealth?: any;
}

function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<UraiUser | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleUserSelect = (user: UraiUser) => {
    setSelectedUser(user);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedUser(null);
  }

  // This is a placeholder for the actual user data we'll get from Firestore
  const mockUsers: UraiUser[] = [
    {
      uid: '123456789',
      email: 'super@urai.com',
      displayName: 'Super Admin',
      customClaims: { role: 'super_admin' },
    } as UraiUser,
    {
      uid: '987654321',
      email: 'test@urai.com',
      displayName: 'Test User',
      customClaims: { role: 'viewer' },
    } as UraiUser,
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <UsersTable onUserSelect={handleUserSelect} users={mockUsers}/>
      <UserDetailPanel
        user={selectedUser}
        isOpen={isPanelOpen}
        onOpenChange={handlePanelClose}
      />
    </div>
  );
}

export default withRole(UsersPage, 'super_admin');
