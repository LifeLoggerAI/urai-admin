'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { logAdminAction } from '@/lib/audit';

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState([]);
  const [newFlagName, setNewFlagName] = useState('');
  const [newFlagDescription, setNewFlagDescription] = useState('');

  const fetchFlags = async () => {
    const flagsCollection = collection(db, 'featureFlags');
    const flagsSnapshot = await getDocs(flagsCollection);
    const flagsList = flagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFlags(flagsList);
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleCreateFlag = async () => {
    if (newFlagName) {
      await addDoc(collection(db, 'featureFlags'), {
        name: newFlagName,
        description: newFlagDescription,
        enabled: false,
      });
      await logAdminAction('create_feature_flag', `Created feature flag "${newFlagName}"`);
      setNewFlagName('');
      setNewFlagDescription('');
      fetchFlags();
    }
  };

  const handleToggleFlag = async (flag) => {
    const flagDocRef = doc(db, 'featureFlags', flag.id);
    await setDoc(flagDocRef, { ...flag, enabled: !flag.enabled });
    await logAdminAction('toggle_feature_flag', `Toggled feature flag "${flag.name}" to ${!flag.enabled}`);
    fetchFlags();
  };

  const handleDeleteFlag = async (flag) => {
    const flagDocRef = doc(db, 'featureFlags', flag.id);
    await deleteDoc(flagDocRef);
    await logAdminAction('delete_feature_flag', `Deleted feature flag "${flag.name}"`);
    fetchFlags();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feature Flags</h1>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Create New Flag</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Flag Name"
            value={newFlagName}
            onChange={(e) => setNewFlagName(e.target.value)}
          />
          <Input
            placeholder="Flag Description"
            value={newFlagDescription}
            onChange={(e) => setNewFlagDescription(e.target.value)}
          />
          <Button onClick={handleCreateFlag}>Create</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flags.map(flag => (
            <TableRow key={flag.id}>
              <TableCell>{flag.name}</TableCell>
              <TableCell>{flag.description}</TableCell>
              <TableCell>{flag.enabled ? 'Enabled' : 'Disabled'}</TableCell>
              <TableCell>
                <Button onClick={() => handleToggleFlag(flag)} className="mr-2">
                  {flag.enabled ? 'Disable' : 'Enable'}
                </Button>
                <Button onClick={() => handleDeleteFlag(flag)} variant="destructive">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
