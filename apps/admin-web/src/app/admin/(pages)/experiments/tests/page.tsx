
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Beaker, FileText, Play, Pause, Trash2, StopCircle } from "lucide-react";
import withAuth from '@/components/withAuth';

const abTests = [
  {
    id: 'ab_001',
    name: 'New Onboarding Flow Engagement',
    status: 'running',
    hypothesis: 'A simplified onboarding flow will increase user retention by 15%.',
    variants: { 'A': { name: 'Control', split: 50 }, 'B': { name: 'New Flow', split: 50 } },
    metric: 'Day 7 Retention',
    confidence: 92,
    startDate: '2023-11-01',
  },
  {
    id: 'ab_002',
    name: 'Timeline Export Button Color',
    status: 'paused',
    hypothesis: 'A green export button will have a higher CTR than the default blue.',
    variants: { 'A': { name: 'Blue Button', split: 50 }, 'B': { name: 'Green Button', split: 50 } },
    metric: 'Export CTR',
    confidence: 68,
    startDate: '2023-10-20',
  },
    { 
    id: 'ab_003', 
    name: 'Marketplace Pricing Model', 
    status: 'concluded', 
    hypothesis: 'Subscription model will generate more revenue than one-time purchases.', 
    variants: { 'A': { name: 'One-Time', split: 50 }, 'B': { name: 'Subscription', split: 50 } },
    metric: 'Avg. Revenue Per User',
    confidence: 99,
    startDate: '2023-09-01',
  },
];

function ABTestsPage() {

  const getStatusVariant = (status: string) => {
      switch(status) {
          case 'running': return 'default';
          case 'paused': return 'secondary';
          case 'concluded': return 'outline';
          default: return 'secondary';
      }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">A/B Testing</h1>
        <Button><PlusCircle className="mr-2 h-4 w-4"/> Create New Test</Button>
      </div>
      
      <div className="space-y-6">
        {abTests.map((test) => (
            <Card key={test.id} className="bg-gray-800/50 border-gray-700 text-white">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-2">
                                <Beaker className="h-5 w-5" />
                                <CardTitle>{test.name}</CardTitle>
                                <Badge variant={getStatusVariant(test.status)}>{test.status}</Badge>
                            </div>
                             <CardDescription className="pt-2">{test.hypothesis}</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                             <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4"/> View Results</Button>
                             {test.status === 'running' && <Button variant="outline" size="icon"><Pause className="h-4 w-4"/></Button>}
                             {test.status === 'paused' && <Button variant="outline" size="icon"><Play className="h-4 w-4"/></Button>}
                             {test.status !== 'concluded' && <Button variant="outline" size="icon" className="border-green-500/50 text-green-400 hover:bg-green-500/10"><StopCircle className="h-4 w-4"/></Button>}
                             <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-700">
                                <TableHead className="text-gray-400">Variant</TableHead>
                                <TableHead className="text-gray-400">Split</TableHead>
                                <TableHead className="text-gray-400">Primary Metric</TableHead>
                                <TableHead className="text-gray-400">Confidence</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(test.variants).map(([key, variant]) => (
                                <TableRow key={key} className="border-gray-700">
                                    <TableCell>{variant.name}</TableCell>
                                    <TableCell>{variant.split}%</TableCell>
                                    <TableCell>{test.metric}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Progress value={test.confidence} className="w-32 h-2"/>
                                            <span>{test.confidence}%</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

export default withAuth(ABTestsPage, ['super_admin', 'admin', 'analyst']);
