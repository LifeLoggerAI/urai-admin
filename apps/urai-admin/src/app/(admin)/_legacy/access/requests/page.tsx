'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminSetUserRole } from '@/lib/firebase';
import { logAdminAction } from '@/lib/audit';

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const requestsCollection = collection(db, 'accessRequests');
    const requestsSnapshot = await getDocs(requestsCollection);
    const requestsList = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRequests(requestsList);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (request) => {
    await adminSetUserRole({ uid: request.id, role: 'staff' });
    await logAdminAction('approve_access_request', `Approved access request for ${request.email}`);
    const requestDocRef = doc(db, 'accessRequests', request.id);
    await deleteDoc(requestDocRef);
    fetchRequests();
  };

  const handleDeny = async (request) => {
    await logAdminAction('deny_access_request', `Denied access request for ${request.email}`);
    const requestDocRef = doc(db, 'accessRequests', request.id);
    await deleteDoc(requestDocRef);
    fetchRequests();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Access Requests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Display Name</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map(request => (
            <TableRow key={request.id}>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.displayName}</TableCell>
              <TableCell>{new Date(request.requestedAt.seconds * 1000).toLocaleString()}</TableCell>
              <TableCell>
                <Button onClick={() => handleApprove(request)} className="mr-2">Approve</Button>
                <Button onClick={() => handleDeny(request)} variant="destructive">Deny</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
