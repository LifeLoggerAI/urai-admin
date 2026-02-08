'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, getUserRole } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AccessPage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const userRole = await getUserRole(currentUser.uid);
        setRole(userRole);

        const requestDocRef = doc(db, 'accessRequests', currentUser.uid);
        const requestDoc = await getDoc(requestDocRef);
        if (requestDoc.exists()) {
          setRequestStatus(requestDoc.data().status);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleRequestAccess = async () => {
    if (user) {
      const requestDocRef = doc(db, 'accessRequests', user.uid);
      await setDoc(requestDocRef, {
        email: user.email,
        displayName: user.displayName,
        requestedAt: new Date(),
        status: 'pending',
      });
      setRequestStatus('pending');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Access Control</h1>
      {user ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>UID:</strong> {user.uid}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {role}</p>
            {role === 'viewer' && (
              <div className="mt-4">
                {requestStatus === 'pending' ? (
                  <p>Your access request is pending.</p>
                ) : (
                  <Button onClick={handleRequestAccess}>Request Access</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}
