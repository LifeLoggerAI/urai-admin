'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var table_1 = require("@/components/ui/table");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var withAuth_1 = require("@/components/withAuth");
var abTests = [
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
    var getStatusVariant = function (status) {
        switch (status) {
            case 'running': return 'default';
            case 'paused': return 'secondary';
            case 'concluded': return 'outline';
            default: return 'secondary';
        }
    };
    return (<div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">A/B Testing</h1>
        <button_1.Button><lucide_react_1.PlusCircle className="mr-2 h-4 w-4"/> Create New Test</button_1.Button>
      </div>
      
      <div className="space-y-6">
        {abTests.map(function (test) { return (<card_1.Card key={test.id} className="bg-gray-800/50 border-gray-700 text-white">
                <card_1.CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-2">
                                <lucide_react_1.Beaker className="h-5 w-5"/>
                                <card_1.CardTitle>{test.name}</card_1.CardTitle>
                                <badge_1.Badge variant={getStatusVariant(test.status)}>{test.status}</badge_1.Badge>
                            </div>
                             <card_1.CardDescription className="pt-2">{test.hypothesis}</card_1.CardDescription>
                        </div>
                        <div className="flex space-x-2">
                             <button_1.Button variant="outline" size="sm"><lucide_react_1.FileText className="mr-2 h-4 w-4"/> View Results</button_1.Button>
                             {test.status === 'running' && <button_1.Button variant="outline" size="icon"><lucide_react_1.Pause className="h-4 w-4"/></button_1.Button>}
                             {test.status === 'paused' && <button_1.Button variant="outline" size="icon"><lucide_react_1.Play className="h-4 w-4"/></button_1.Button>}
                             {test.status !== 'concluded' && <button_1.Button variant="outline" size="icon" className="border-green-500/50 text-green-400 hover:bg-green-500/10"><lucide_react_1.StopCircle className="h-4 w-4"/></button_1.Button>}
                             <button_1.Button variant="destructive" size="icon"><lucide_react_1.Trash2 className="h-4 w-4"/></button_1.Button>
                        </div>
                    </div>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <table_1.Table>
                        <table_1.TableHeader>
                            <table_1.TableRow className="border-gray-700">
                                <table_1.TableHead className="text-gray-400">Variant</table_1.TableHead>
                                <table_1.TableHead className="text-gray-400">Split</table_1.TableHead>
                                <table_1.TableHead className="text-gray-400">Primary Metric</table_1.TableHead>
                                <table_1.TableHead className="text-gray-400">Confidence</table_1.TableHead>
                            </table_1.TableRow>
                        </table_1.TableHeader>
                        <table_1.TableBody>
                            {Object.entries(test.variants).map(function (_a) {
                var key = _a[0], variant = _a[1];
                return (<table_1.TableRow key={key} className="border-gray-700">
                                    <table_1.TableCell>{variant.name}</table_1.TableCell>
                                    <table_1.TableCell>{variant.split}%</table_1.TableCell>
                                    <table_1.TableCell>{test.metric}</table_1.TableCell>
                                    <table_1.TableCell>
                                        <div className="flex items-center space-x-2">
                                            <progress_1.Progress value={test.confidence} className="w-32 h-2"/>
                                            <span>{test.confidence}%</span>
                                        </div>
                                    </table_1.TableCell>
                                </table_1.TableRow>);
            })}
                        </table_1.TableBody>
                    </table_1.Table>
                </card_1.CardContent>
            </card_1.Card>); })}
      </div>
    </div>);
}
exports.default = (0, withAuth_1.default)(ABTestsPage, ['super_admin', 'admin', 'analyst']);
