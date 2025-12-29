'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Policy {
  id: string;
  name: string;
  content: string;
}

const PolicyManager = () => {
  const [policies, loading, error] = useCollection(collection(db, 'policies'));
  const [newPolicy, setNewPolicy] = useState({ name: '', content: '' });
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  const createPolicy = async (e: FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'policies'), newPolicy);
    setNewPolicy({ name: '', content: '' });
    toast.success('Policy created successfully!');
  };

  const updatePolicy = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPolicy) return;
    const docRef = doc(db, 'policies', editingPolicy.id);
    await updateDoc(docRef, { name: editingPolicy.name, content: editingPolicy.content });
    setEditingPolicy(null);
    toast.success('Policy updated successfully!');
  };

  const deletePolicy = async (id: string) => {
    await deleteDoc(doc(db, 'policies', id));
    toast.success('Policy deleted successfully!');
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Policy Manager</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        {editingPolicy ? (
          <form onSubmit={updatePolicy} className="space-y-4">
            <h2 className="text-xl font-semibold">Edit Policy</h2>
            <div>
              <label htmlFor="editing-name" className="block text-sm font-medium text-gray-700">Policy Name</label>
              <input
                id="editing-name"
                type="text"
                placeholder="Policy Name"
                value={editingPolicy.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (editingPolicy) {
                    setEditingPolicy({ ...editingPolicy, name: e.target.value })
                  }
                }}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="editing-content" className="block text-sm font-medium text-gray-700">Policy Content</label>
              <textarea
                id="editing-content"
                placeholder="Policy Content"
                value={editingPolicy.content}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  if (editingPolicy) {
                    setEditingPolicy({ ...editingPolicy, content: e.target.value })
                  }
                }}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Policy'}
              </button>
              <button onClick={() => setEditingPolicy(null)} disabled={loading} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={createPolicy} className="space-y-4">
            <h2 className="text-xl font-semibold">Create Policy</h2>
            <div>
              <label htmlFor="new-name" className="block text-sm font-medium text-gray-700">Policy Name</label>
              <input
                id="new-name"
                type="text"
                placeholder="Policy Name"
                value={newPolicy.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="new-content" className="block text-sm font-medium text-gray-700">Policy Content</label>
              <textarea
                id="new-content"
                placeholder="Policy Content"
                value={newPolicy.content}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Policy'}
            </button>
          </form>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Policies</h2>
        {error && <p className="text-red-500">Error: {JSON.stringify(error)}</p>}
        {loading && <p>Loading...</p>}
        {policies && (
          <ul className="space-y-4">
            {policies.docs.map((policyDoc) => {
              const policyData = policyDoc.data() as { name: string, content: string };
              const policy: Policy = { id: policyDoc.id, ...policyData };
              return (
                <li key={policy.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{policy.name}</p>
                    <p className="text-sm text-gray-600">{policy.content}</p>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => setEditingPolicy(policy)} disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50">
                      Edit
                    </button>
                    <button onClick={() => deletePolicy(policy.id)} disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PolicyManager;