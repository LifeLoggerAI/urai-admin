'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
var card_1 = require("@/components/ui/card");
var alert_1 = require("@/components/ui/alert");
var recharts_1 = require("recharts");
var lucide_react_1 = require("lucide-react");
var activeUsersData = [
    { name: '24h', value: 12543 },
    { name: '7d', value: 89321 },
    { name: '30d', value: 254321 },
];
var revenueData = [
    { name: 'Q1', revenue: 45000 },
    { name: 'Q2', revenue: 52000 },
    { name: 'Q3', revenue: 78000 },
    { name: 'Q4', revenue: 65000 },
];
var StatCard = function (_a) {
    var title = _a.title, value = _a.value, icon = _a.icon, description = _a.description;
    return (<card_1.Card className="bg-gray-800/50 border-gray-700 text-white">
        <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
            <card_1.CardTitle className="text-sm font-medium">{title}</card_1.CardTitle>
            {icon}
        </card_1.CardHeader>
        <card_1.CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-gray-400">{description}</p>
        </Content>
    </card_1.Card>);
};
function DashboardPage() {
    return (<div className="p-4 sm:p-6 md:p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Global Overview</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard title="Global System Health" value="99.98%" icon={<lucide_react_1.Shield className="h-4 w-4 text-gray-400"/>} description="Uptime last 30 days"/>
            <StatCard title="AI Systems Online" value="12 / 12" icon={<lucide_react_1.BrainCircuit className="h-4 w-4 text-gray-400"/>} description="All models responding"/>
            <StatCard title="Jobs Running" value="1,402" icon={<lucide_react_1.Server className="h-4 w-4 text-gray-400"/>} description="5 failed in last 24h"/>
            <StatCard title="Active Users (24h)" value="12,543" icon={<lucide_react_1.Users className="h-4 w-4 text-gray-400"/>} description="+5% from yesterday"/>
        </div>
        
        <alert_1.Alert className="mb-6 bg-yellow-900/50 border-yellow-700 text-yellow-300">
            <lucide_react_1.AlertTriangle className="h-4 w-4 !text-yellow-300"/>
            <alert_1.AlertTitle>High Latency Warning</alert_1.AlertTitle>
            <alert_1.AlertDescription>
                The Timeline Replay Generation pipeline is experiencing higher than normal latency (p95 &gt; 500ms). The on-call team has been notified.
            </alert_1.AlertDescription>
        </alert_1.Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <card_1.Card className="lg:col-span-3 bg-gray-800/50 border-gray-700 text-white">
                <card_1.CardHeader>
                    <card_1.CardTitle>Active Users</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <recharts_1.ResponsiveContainer width="100%" height={300}>
                        <recharts_1.BarChart data={activeUsersData}>
                            <recharts_1.XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <recharts_1.YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={function (value) { return "".concat(value / 1000, "k"); }}/>
                            <recharts_1.Tooltip wrapperClassName="border-gray-700 bg-gray-900"/>
                            <recharts_1.Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}/>
                        </recharts_1.BarChart>
                    </recharts_1.ResponsiveContainer>
                </card_1.CardContent>
            </card_1.Card>

            <card_1.Card className="lg:col-span-4 bg-gray-800/50 border-gray-700 text-white">
                <card_1.CardHeader>
                    <card_1.CardTitle>Quarterly Revenue Snapshot</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                     <recharts_1.ResponsiveContainer width="100%" height={300}>
                        <recharts_1.LineChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <recharts_1.XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <recharts_1.YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={function (value) { return "$".concat(value / 1000, "k"); }}/>
                            <recharts_1.Tooltip wrapperClassName="border-gray-700 bg-gray-900"/>
                            <recharts_1.Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2}/>
                        </recharts_1.LineChart>
                    </recharts_1.ResponsiveContainer>
                </card_1.CardContent>
            </card_1.Card>

        </div>
    </div>);
}
