'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Siren, User, ShieldCheck, FileSearch } from "lucide-react";
import withAuth from '@/components/withAuth';

const crisisLogs = [
  {
    id: 'cl_001',
    timestamp: '2023-11-15 10:30:00 UTC',
    userId: 'usr_009',
    riskType: 'High Risk: Self-Harm Intent',
    confidence: 0.98,
    status: 'new',
    trigger: 'Text analysis of recent journal entries.',
  },
  {
    id: 'cl_002',
    timestamp: '2023-11-15 09:15:00 UTC',
    userId: 'usr_021',
    riskType: 'Moderate Risk: Substance Abuse',
    confidence: 0.85,
    status: 'under_review',
    assignedTo: 'mod_002',
    trigger: 'Pattern detection in passive location data.',
  },
  {
    id: 'cl_003',
    timestamp: '2023-11-14 22:05:00 UTC',
    userId: 'usr_015',
    riskType: 'High Risk: Violent Ideation',
    confidence: 0.95,
    status: 'resolved',
    assignedTo: 'mod_001',
    resolution: 'User engaged with crisis support chat. De-escalated.',
    trigger: 'Image content analysis from user upload.',
  },
];

const getRiskVariant = (risk: string) => {
    if (risk.includes('High')) return 'destructive';
    if (risk.includes('Moderate')) return 'secondary';
    return 'outline';
}

function CrisisLogsPage() {

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Crisis Intervention Logs</h1>
      </div>
      
      <Card className="bg-red-900/20 border-red-700/50 text-white">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center"><Siren className="mr-2 text-red-400"/> Active & Recent Crisis Events</CardTitle>
                <CardDescription className="pt-2">This is a real-time log of users flagged for severe crisis events. Access is restricted and all actions are logged.</CardDescription>
            </div>
            <div className="flex space-x-2">
                 <Select>
                    <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Timestamp</TableHead>
                <TableHead className="text-gray-400">User ID</TableHead>
                <TableHead className="text-gray-400">Risk Detected</TableHead>
                <TableHead className="text-gray-400">Confidence</TableHead>
                 <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crisisLogs.map((log) => (
                <TableRow key={log.id} className="border-gray-700 hover:bg-red-900/30">
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell className="font-mono">{log.userId}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskVariant(log.riskType)}>{log.riskType}</Badge>
                  </TableCell>
                  <TableCell>{(log.confidence * 100).toFixed(1)}%</TableCell>
                   <TableCell>
                       <Badge variant={log.status === 'new' ? 'default' : 'secondary'}>{log.status}</Badge>
                   </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2"><FileSearch className="mr-2 h-4 w-4"/> View Log</Button>
                    <Button variant="secondary" size="sm"><User className="mr-2 h-4 w-4"/> Go to User</Button>
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

export default withAuth(CrisisLogsPage, ['super_admin', 'moderator']);
