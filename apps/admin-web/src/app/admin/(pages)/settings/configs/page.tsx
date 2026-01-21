
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, PlusCircle, Trash2 } from "lucide-react";
import withAuth from '@/components/withAuth';
import { useState } from 'react';

const initialConfigs = [
  { key: 'API_THROTTLE_RATE', value: '100/min' },
  { key: 'TIMELINE_GENERATION_TIMEOUT', value: '30000' },
  { key: 'AI_CONFIDENCE_THRESHOLD', value: '0.85' },
  { key: 'ASSET_FACTORY_ENDPOINT', value: '*****************' }, // Masked
];

function ConfigurationsPage() {
  const [configs, setConfigs] = useState(initialConfigs);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddConfig = () => {
      if(newKey && newValue) {
          setConfigs([...configs, { key: newKey, value: newValue }]);
          setNewKey('');
          setNewValue('');
      }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">System Configurations</h1>
      <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader>
            <CardTitle>Environment & Feature Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Key</TableHead>
                <TableHead className="text-gray-400">Value</TableHead>
                <TableHead className="w-[100px] text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config, index) => (
                <TableRow key={index} className="border-gray-700">
                  <TableCell><Input defaultValue={config.key} className="bg-gray-900 border-gray-700"/></TableCell>
                  <TableCell><Input defaultValue={config.value} className="bg-gray-900 border-gray-700"/></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Save className="h-4 w-4 text-green-400"/></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500"/></Button>
                  </TableCell>
                </TableRow>
              ))}
                <TableRow className="border-gray-700">
                    <TableCell><Input placeholder="New Key" value={newKey} onChange={e => setNewKey(e.target.value)} className="bg-gray-900 border-gray-700" /></TableCell>
                    <TableCell><Input placeholder="New Value" value={newValue} onChange={e => setNewValue(e.target.value)} className="bg-gray-900 border-gray-700" /></TableCell>
                    <TableCell>
                        <Button onClick={handleAddConfig}><PlusCircle className="mr-2 h-4 w-4"/> Add</Button>
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(ConfigurationsPage, ['super_admin', 'admin']);
