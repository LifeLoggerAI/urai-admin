
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, Save, Trash2, Sliders } from "lucide-react";
import withAuth from '@/components/withAuth';
import { useState } from 'react';

const featureFlags = [
  { 
    id: 'ff_001', 
    name: 'New Timeline View', 
    description: 'Enables the new spatial timeline interface.', 
    status: 'active', 
    rollout: 50, 
    segments: ['internal', 'beta_testers'] 
  },
  { 
    id: 'ff_002', 
    name: 'AI-Assisted Search', 
    description: 'Uses a large language model to enhance search queries.', 
    status: 'inactive', 
    rollout: 0, 
    segments: [] 
  },
  { 
    id: 'ff_003', 
    name: 'CapCut Integration', 
    description: 'Allows direct export of timelines to CapCut.', 
    status: 'active', 
    rollout: 100, 
    segments: ['all'] 
  },
];

function FeatureFlagsPage() {

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Feature Flag Management</h1>
      <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader>
            <CardTitle>All Feature Flags</CardTitle>
             <div className="flex items-center space-x-2 pt-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or description" className="pl-8 bg-gray-900 border-gray-700" />
                </div>
                <Button><PlusCircle className="mr-2 h-4 w-4"/> Create New Flag</Button>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Rollout %</TableHead>
                <TableHead className="text-gray-400">Target Segments</TableHead>
                <TableHead className="w-[150px] text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featureFlags.map((flag) => (
                <TableRow key={flag.id} className="border-gray-700">
                  <TableCell>
                      <div className="font-medium">{flag.name}</div>
                      <div className="text-sm text-gray-500">{flag.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                        <Switch id={`switch-${flag.id}`} checked={flag.status === 'active'} className="data-[state=checked]:bg-green-500" />
                        <label htmlFor={`switch-${flag.id}`}>{flag.status === 'active' ? 'Active' : 'Inactive'}</label>
                    </div>
                  </TableCell>
                  <TableCell>
                      <div className="flex items-center space-x-2">
                        <Sliders className="h-4 w-4"/>
                        <Input type="number" defaultValue={flag.rollout} className="w-20 bg-gray-900 border-gray-700"/>
                      </div>
                  </TableCell>
                  <TableCell>
                      <div className="flex flex-wrap gap-1">
                          {flag.segments.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                      </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Save className="h-4 w-4 text-green-400"/></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500"/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(FeatureFlagsPage, ['super_admin', 'admin']);
