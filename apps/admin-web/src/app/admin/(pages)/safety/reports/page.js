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
var abuseReports = [
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
var getStatusVariant = function (status) {
    switch (status) {
        case 'pending_review': return 'destructive';
        case 'action_taken': return 'default';
        case 'dismissed': return 'outline';
        default: return 'secondary';
    }
};
function AbuseReportsPage() {
    return (<div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">User Abuse Reports</h1>
      
      <card_1.Card className="bg-gray-800/50 border-gray-700 text-white">
        <card_1.CardHeader>
           <div className="flex justify-between items-start">
                <div>
                    <card_1.CardTitle className="flex items-center"><lucide_react_1.AlertOctagon className="mr-2"/> Pending & Recent Reports</card_1.CardTitle>
                    <card_1.CardDescription className="pt-2">Review user-submitted reports of abuse, harassment, spam, and other violations.</card_1.CardDescription>
                </div>
                <select_1.Select>
                    <select_1.SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                        <select_1.SelectValue placeholder="Filter by status"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                        <select_1.SelectItem value="all">All Statuses</select_1.SelectItem>
                        <select_1.SelectItem value="pending_review">Pending</select_1.SelectItem>
                        <select_1.SelectItem value="action_taken">Action Taken</select_1.SelectItem>
                        <select_1.SelectItem value="dismissed">Dismissed</select_1.SelectItem>
                    </select_1.SelectContent>
                </select_1.Select>
            </div>
        </card_1.CardHeader>
        <card_1.CardContent>
          <table_1.Table>
            <table_1.TableHeader>
              <table_1.TableRow className="border-gray-700">
                <table_1.TableHead className="text-gray-400">Timestamp</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">Reported User</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">Reporting User</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">Reason</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">Status</table_1.TableHead>
                <table_1.TableHead className="text-right text-gray-400">Actions</table_1.TableHead>
              </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
              {abuseReports.map(function (report) { return (<table_1.TableRow key={report.id} className="border-gray-700">
                  <table_1.TableCell className="font-mono text-sm">{report.timestamp}</table_1.TableCell>
                  <table_1.TableCell className="font-mono">{report.reportedUserId}</table_1.TableCell>
                  <table_1.TableCell className="font-mono">{report.reportingUserId}</table_1.TableCell>
                  <table_1.TableCell>{report.reason}</table_1.TableCell>
                  <table_1.TableCell><badge_1.Badge variant={getStatusVariant(report.status)}>{report.status}</badge_1.Badge></table_1.TableCell>
                  <table_1.TableCell className="text-right">
                    <button_1.Button variant="outline" size="sm" className="mr-2"><lucide_react_1.Link className="mr-2 h-4 w-4"/> View Content</button_1.Button>
                    <button_1.Button variant="secondary" size="sm"><lucide_react_1.Shield className="mr-2 h-4 w-4"/> Take Action</button_1.Button>
                  </table_1.TableCell>
                </table_1.TableRow>); })}
            </table_1.TableBody>
          </table_1.Table>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
exports.default = (0, withAuth_1.default)(AbuseReportsPage, ['super_admin', 'admin', 'moderator']);
