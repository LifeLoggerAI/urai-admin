'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var switch_1 = require("@/components/ui/switch");
var badge_1 = require("@/components/ui/badge");
var table_1 = require("@/components/ui/table");
var lucide_react_1 = require("lucide-react");
var withAuth_1 = require("@/components/withAuth");
var featureFlags = [
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
    return (<div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Feature Flag Management</h1>
      <card_1.Card className="bg-gray-800/50 border-gray-700 text-white">
        <card_1.CardHeader>
            <card_1.CardTitle>All Feature Flags</card_1.CardTitle>
             <div className="flex items-center space-x-2 pt-4">
                <div className="relative flex-grow">
                    <lucide_react_1.Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <input_1.Input placeholder="Search by name or description" className="pl-8 bg-gray-900 border-gray-700"/>
                </div>
                <button_1.Button><lucide_react_1.PlusCircle className="mr-2 h-4 w-4"/> Create New Flag</button_1.Button>
            </div>
        </card_1.CardHeader>
        <card_1.CardContent>
          <table_1.Table>
            <table_1.TableHeader>
              <table_1.TableRow className="border-gray-700">
                <table_1.TableHead className="text-gray-400">Name</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">Status</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">Rollout %</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">Target Segments</table_1.TableHead>
                <table_1.TableHead className="w-[150px] text-right text-gray-400">Actions</table_1.TableHead>
              </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
              {featureFlags.map(function (flag) { return (<table_1.TableRow key={flag.id} className="border-gray-700">
                  <table_1.TableCell>
                      <div className="font-medium">{flag.name}</div>
                      <div className="text-sm text-gray-500">{flag.description}</div>
                  </table_1.TableCell>
                  <table_1.TableCell>
                    <div className="flex items-center space-x-2">
                        <switch_1.Switch id={"switch-".concat(flag.id)} checked={flag.status === 'active'} className="data-[state=checked]:bg-green-500"/>
                        <label htmlFor={"switch-".concat(flag.id)}>{flag.status === 'active' ? 'Active' : 'Inactive'}</label>
                    </div>
                  </table_1.TableCell>
                  <table_1.TableCell>
                      <div className="flex items-center space-x-2">
                        <lucide_react_1.Sliders className="h-4 w-4"/>
                        <input_1.Input type="number" defaultValue={flag.rollout} className="w-20 bg-gray-900 border-gray-700"/>
                      </div>
                  </table_1.TableCell>
                  <table_1.TableCell>
                      <div className="flex flex-wrap gap-1">
                          {flag.segments.map(function (s) { return <badge_1.Badge key={s} variant="secondary">{s}</badge_1.Badge>; })}
                      </div>
                  </table_1.TableCell>
                  <table_1.TableCell className="text-right">
                    <button_1.Button variant="ghost" size="icon"><lucide_react_1.Save className="h-4 w-4 text-green-400"/></button_1.Button>
                    <button_1.Button variant="ghost" size="icon"><lucide_react_1.Trash2 className="h-4 w-4 text-red-500"/></button_1.Button>
                  </table_1.TableCell>
                </table_1.TableRow>); })}
            </table_1.TableBody>
          </table_1.Table>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
exports.default = (0, withAuth_1.default)(FeatureFlagsPage, ['super_admin', 'admin']);
