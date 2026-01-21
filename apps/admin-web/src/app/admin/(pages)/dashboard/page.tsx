
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Shield, Users, Server, BrainCircuit, AlertTriangle, Activity, DollarSign } from 'lucide-react';
import { ReactNode } from 'react';

const activeUsersData = [
  { name: '24h', value: 12543 },
  { name: '7d', value: 89321 },
  { name: '30d', value: 254321 },
];

const revenueData = [
    { name: 'Q1', revenue: 45000 },
    { name: 'Q2', revenue: 52000 },
    { name: 'Q3', revenue: 78000 },
    { name: 'Q4', revenue: 65000 },
];

const StatCard = ({ title, value, icon, description }: { title: string, value: string, icon: ReactNode, description: string }) => (
    <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-gray-400">{description}</p>
        </CardContent>
    </Card>
);


export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Global Overview</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard title="Global System Health" value="99.98%" icon={<Shield className="h-4 w-4 text-gray-400" />} description="Uptime last 30 days" />
            <StatCard title="AI Systems Online" value="12 / 12" icon={<BrainCircuit className="h-4 w-4 text-gray-400" />} description="All models responding" />
            <StatCard title="Jobs Running" value="1,402" icon={<Server className="h-4 w-4 text-gray-400" />} description="5 failed in last 24h" />
            <StatCard title="Active Users (24h)" value="12,543" icon={<Users className="h-4 w-4 text-gray-400" />} description="+5% from yesterday" />
        </div>
        
        <Alert className="mb-6 bg-yellow-900/50 border-yellow-700 text-yellow-300">
            <AlertTriangle className="h-4 w-4 !text-yellow-300" />
            <AlertTitle>High Latency Warning</AlertTitle>
            <AlertDescription>
                The Timeline Replay Generation pipeline is experiencing higher than normal latency (p95 > 500ms). The on-call team has been notified.
            </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3 bg-gray-800/50 border-gray-700 text-white">
                <CardHeader>
                    <CardTitle>Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={activeUsersData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip wrapperClassName="border-gray-700 bg-gray-900"/>
                            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-4 bg-gray-800/50 border-gray-700 text-white">
                <CardHeader>
                    <CardTitle>Quarterly Revenue Snapshot</CardTitle>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip wrapperClassName="border-gray-700 bg-gray-900"/>
                            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    </div>
  );
}
