'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var table_1 = require("@/components/ui/table");
var badge_1 = require("@/components/ui/badge");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var withAuth_1 = require("@/components/withAuth");
var crisisLogs = [
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
var getRiskVariant = function (risk) {
    if (risk.includes('High'))
        return 'destructive';
    if (risk.includes('Moderate'))
        return 'secondary';
    return 'outline';
};
function CrisisLogsPage() {
    return (<div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Crisis Intervention Logs</h1>
      </div>
      
      <card_1.Card className="bg-red-900/20 border-red-700/50 text-white">
        <card_1.CardHeader>
          <div className="flex justify-between items-start">
            <div>
                <card_1.CardTitle className="flex items-center"><lucide_react_1.Siren className="mr-2 text-red-400"/> Active & Recent Crisis Events</card_1.CardTitle>
                <card_1.CardDescription className="pt-2">This is a real-time log of users flagged for severe crisis events. Access is restricted and all actions are logged.</card_1.CardDescription>
            </div>
            <div className="flex space-x-2">
                 <select_1.Select>
                    <select_1.SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                        <select_1.SelectValue placeholder="Filter by status"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                        <select_1.SelectItem value="all">All Statuses</select_1.SelectItem>
                        <select_1.SelectItem value="new">New</select_1.SelectItem>
                        <select_1.SelectItem value="under_review">Under Review</select_1.SelectItem>
                        <select_1.SelectItem value="resolved">Resolved</select_1.SelectItem>
                    </select_1.SelectContent>
                </select_1.Select>
            </div>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent>
          <table_1.Table>
            <table_1.TableHeader>
              <table_1.TableRow className="border-gray-700">
                <table_1.TableHead className="text-gray-400">Timestamp</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">User ID</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">Risk Detected</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">Confidence</table_1.TableHead>
                 <table_1.TableHead className="text-gray-400">Status</table_1.TableHead>
                <table_1.TableHead className="text-right text-gray-400">Actions</table_1.TableHead>
              </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
              {crisisLogs.map(function (log) { return (<table_1.TableRow key={log.id} className="border-gray-700 hover:bg-red-900/30">
                  <table_1.TableCell className="font-mono text-sm">{log.timestamp}</table_1.TableCell>
                  <table_1.TableCell className="font-mono">{log.userId}</table_1.TableCell>
                  <table_1.TableCell>
                    <badge_1.Badge variant={getRiskVariant(log.riskType)}>{log.riskType}</badge_1.Badge>
                  </table_1.TableCell>
                  <table_1.TableCell>{(log.confidence * 100).toFixed(1)}%</table_1.TableCell>
                   <table_1.TableCell>
                       <badge_1.Badge variant={log.status === 'new' ? 'default' : 'secondary'}>{log.status}</badge_1.Badge>
                   </table_1.TableCell>
                  <table_1.TableCell className="text-right">
                    <button_1.Button variant="outline" size="sm" className="mr-2"><lucide_react_1.FileSearch className="mr-2 h-4 w-4"/> View Log</button_1.Button>
                    <button_1.Button variant="secondary" size="sm"><lucide_react_1.User className="mr-2 h-4 w-4"/> Go to User</button_1.Button>
                  </table_1.TableCell>
                </table_1.TableRow>); })}
            </table_1.TableBody>
          </table_1.Table>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
exports.default = (0, withAuth_1.default)(CrisisLogsPage, ['super_admin', 'moderator']);
