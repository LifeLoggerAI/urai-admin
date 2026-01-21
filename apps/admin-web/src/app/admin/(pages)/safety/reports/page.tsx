
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, Link as LinkIcon, AlertOctagon } from "lucide-react";
import withAuth from '@/components/withAuth';

const abuseReports = [
  {
    id: 'rep_001',
    timestamp: '2023-11-14 18:45:00 UTC',
    reportingUserId: 'usr_034',
    reportedUserId: 'usr_052',
    reason: 'Harassment',
    status: 'pending_review',
    contentUrl: '/content/path/to/evidence'
  },
  {
    id: 'rep_002',
    timestamp: '2023-11-13 12:00:00 UTC',
    reportingUserId: 'usr_011',
    reportedUserId: 'usr_029',
    reason: 'Spam',
    status: 'action_taken',
    action: 'User suspended for 7 days',
    reviewer: 'mod_003'
  },
  {
    id: 'rep_003',
    timestamp: '2023-11-12 05:20:00 UTC',
    reportingUserId: 'usr_007',
    reportedUserId: 'usr_081',
    reason: 'Impersonation',
    status: 'dismissed',
    action: 'No violation found after review',
    reviewer: 'mod_001'
  },
];

const getStatusVariant = (status: string) => {
    switch(status) {
        case 'pending_review': return 'destructive';
        case 'action_taken': return 'default';
        case 'dismissed': return 'outline';
        default: return 'secondary';
    }
}

function AbuseReportsPage() {

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">User Abuse Reports</h1>
      
      <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader>
           <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center"><AlertOctagon className="mr-2"/> Pending & Recent Reports</CardTitle>
                    <CardDescription className="pt-2">Review user-submitted reports of abuse, harassment, spam, and other violations.</CardDescription>
                </div>
                <Select>
                    <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending_review">Pending</SelectItem>
                        <SelectItem value="action_taken">Action Taken</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Timestamp</TableHead>
                <TableHead className="text-gray-400">Reported User</TableHead>
                <TableHead className="text-gray-400">Reporting User</TableHead>
                <TableHead className="text-gray-400">Reason</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {abuseReports.map((report) => (
                <TableRow key={report.id} className="border-gray-700">
                  <TableCell className="font-mono text-sm">{report.timestamp}</TableCell>
                  <TableCell className="font-mono">{report.reportedUserId}</TableCell>
                  <TableCell className="font-mono">{report.reportingUserId}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell><Badge variant={getStatusVariant(report.status)}>{report.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2"><LinkIcon className="mr-2 h-4 w-4"/> View Content</Button>
                    <Button variant="secondary" size="sm"><Shield className="mr-2 h-4 w-4"/> Take Action</Button>
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

export default withAuth(AbuseReportsPage, ['super_admin', 'admin', 'moderator']);
