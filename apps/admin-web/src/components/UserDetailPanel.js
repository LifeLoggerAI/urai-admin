'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetailPanel = UserDetailPanel;
var sheet_1 = require("@/components/ui/sheet");
var avatar_1 = require("@/components/ui/avatar");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
// Mock data for a single user to populate the panel
var detailedUser = {
    id: 'usr_004', name: 'Diana Prince', email: 'diana.p@example.com', role: 'admin', status: 'shadow-banned', lastActive: '1 week ago', createdAt: '2022-11-05',
    devices: [
        { id: 'dev_01', type: 'mobile', lastSeen: '2 hours ago', ip: '192.168.1.10' },
        { id: 'dev_02', type: 'desktop', lastSeen: '1 day ago', ip: '10.0.0.5' },
    ],
    consentTiers: [
        { id: 'cons_01', name: 'Personalized Ads', granted: true },
        { id: 'cons_02', name: 'Data Analytics', granted: true },
        { id: 'cons_03', name: 'Voice Analysis', granted: false },
    ],
    featureFlags: [
        { id: 'ff_001', name: 'New Timeline View', active: true },
        { id: 'ff_003', name: 'CapCut Integration', active: false },
    ],
    mentalLoad: { score: 78, trend: 'up' },
    timelineHealth: 95,
    archetype: 'The Explorer',
};
function UserDetailPanel(_a) {
    var user = _a.user, isOpen = _a.isOpen, onOpenChange = _a.onOpenChange;
    var currentUser = user ? detailedUser : null; // Use detailed mock data for the selected user
    if (!currentUser) {
        return null;
    }
    return (<sheet_1.Sheet open={isOpen} onOpenChange={onOpenChange}>
      <sheet_1.SheetContent className="w-[500px] sm:w-[640px] bg-gray-900 border-gray-800 text-white flex flex-col">
        <sheet_1.SheetHeader>
          <div className="flex items-center space-x-4">
            <avatar_1.Avatar className="h-16 w-16">
              <avatar_1.AvatarImage src={currentUser.avatarUrl}/>
              <avatar_1.AvatarFallback>{currentUser.name.charAt(0)}</avatar_1.AvatarFallback>
            </avatar_1.Avatar>
            <div>
              <sheet_1.SheetTitle className="text-2xl">{currentUser.name}</sheet_1.SheetTitle>
              <sheet_1.SheetDescription>{currentUser.email}</sheet_1.SheetDescription>
              <div className="flex items-center space-x-2 mt-2">
                <badge_1.Badge variant={currentUser.status === 'active' ? 'default' : 'destructive'}>{currentUser.status}</badge_1.Badge>
                <badge_1.Badge variant="secondary">{currentUser.role}</badge_1.Badge>
              </div>
            </div>
          </div>
        </sheet_1.SheetHeader>

        <div className="py-4 flex-grow">
          <tabs_1.Tabs defaultValue="overview" className="h-full flex flex-col">
            <tabs_1.TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <tabs_1.TabsTrigger value="overview">Overview</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="health">Health</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="settings">Settings</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="admin">Admin Actions</tabs_1.TabsTrigger>
            </tabs_1.TabsList>
            
            <tabs_1.TabsContent value="overview" className="flex-grow overflow-y-auto p-1 mt-2">
                 <card_1.Card className="bg-gray-800/50 border-gray-700">
                    <card_1.CardHeader><card_1.CardTitle>User Details</card_1.CardTitle></card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><strong>User ID:</strong> <span className="font-mono">{currentUser.id}</span></p>
                            <p><strong>Created At:</strong> {currentUser.createdAt}</p>
                            <p><strong>Last Active:</strong> {currentUser.lastActive}</p>
                             <p><strong>Current Archetype:</strong> {currentUser.archetype}</p>
                        </div>
                    </card_1.CardContent>
                 </card_1.Card>
                 <card_1.Card className="mt-4 bg-gray-800/50 border-gray-700">
                    <card_1.CardHeader><card_1.CardTitle>Registered Devices</card_1.CardTitle></card_1.CardHeader>
                    <card_1.CardContent>
                         <ul className="space-y-3">
                            {currentUser.devices.map(function (d) { return (<li key={d.id} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">{d.type === 'mobile' ? <lucide_react_1.Smartphone className="mr-2"/> : <lucide_react_1.Server className="mr-2"/>}{d.ip}</div>
                                    <span className="text-gray-400">Last seen {d.lastSeen}</span>
                                </li>); })}
                        </ul>
                    </card_1.CardContent>
                 </card_1.Card>
            </tabs_1.TabsContent>

            <tabs_1.TabsContent value="health" className="flex-grow overflow-y-auto p-1 mt-2">
                <card_1.Card className="bg-gray-800/50 border-gray-700">
                    <card_1.CardHeader><card_1.CardTitle>Mental Load</card_1.CardTitle></card_1.CardHeader>
                    <card_1.CardContent>
                        <p className="text-4xl font-bold">{currentUser.mentalLoad.score}<span className="text-lg">/100</span></p>
                        <p className="text-gray-400">Trend is currently {currentUser.mentalLoad.trend}.</p>
                    </card_1.CardContent>
                 </card_1.Card>
                 <card_1.Card className="mt-4 bg-gray-800/50 border-gray-700">
                    <card_1.CardHeader><card_1.CardTitle>Timeline Health</card_1.CardTitle></card_1.CardHeader>
                    <card_1.CardContent>
                        <p className="text-4xl font-bold">{currentUser.timelineHealth}%</p>
                        <p className="text-gray-400">Represents the integrity and completeness of the user's timeline data.</p>
                    </card_1.CardContent>
                 </card_1.Card>
            </tabs_1.TabsContent>

             <tabs_1.TabsContent value="settings" className="flex-grow overflow-y-auto p-1 mt-2">
                <card_1.Card className="bg-gray-800/50 border-gray-700">
                    <card_1.CardHeader><card_1.CardTitle>Consent Tiers</card_1.CardTitle></card_1.CardHeader>
                    <card_1.CardContent>
                        <ul className="space-y-2">
                            {currentUser.consentTiers.map(function (c) { return (<li key={c.id} className="flex items-center justify-between">
                                    <span>{c.name}</span>
                                    {c.granted ? <lucide_react_1.CheckCircle className="text-green-500"/> : <lucide_react_1.XCircle className="text-red-500"/>}
                                </li>); })}
                        </ul>
                    </card_1.CardContent>
                 </card_1.Card>
                  <card_1.Card className="mt-4 bg-gray-800/50 border-gray-700">
                    <card_1.CardHeader><card_1.CardTitle>Active Feature Flags</card_1.CardTitle></card_1.CardHeader>
                    <card_1.CardContent>
                         <ul className="space-y-2">
                            {currentUser.featureFlags.map(function (f) { return (<li key={f.id} className="flex items-center justify-between">
                                    <span>{f.name}</span>
                                    <badge_1.Badge variant={f.active ? 'default' : 'outline'}>{f.active ? 'On' : 'Off'}</badge_1.Badge>
                                </li>); })}
                        </ul>
                    </card_1.CardContent>
                 </card_1.Card>
            </tabs_1.TabsContent>

            <tabs_1.TabsContent value="admin" className="flex-grow overflow-y-auto p-1 mt-2">
                <card_1.Card className="bg-red-900/20 border-red-700/50">
                    <card_1.CardHeader><card_1.CardTitle>Danger Zone</card_1.CardTitle></card_1.CardHeader>
                    <card_1.CardContent className="space-y-3">
                        <button_1.Button variant="destructive" className="w-full justify-start"><lucide_react_1.Ban className="mr-2"/> Suspend User</button_1.Button>
                        <button_1.Button variant="destructive" className="w-full justify-start"><lucide_react_1.ShieldOff className="mr-2"/> Shadow-Ban User</button_1.Button>
                        <button_1.Button variant="secondary" className="w-full justify-start"><lucide_react_1.RefreshCw className="mr-2"/> Reset Feature Flags</button_1.Button>
                        <button_1.Button variant="secondary" className="w-full justify-start"><lucide_react_1.Download className="mr-2"/> Export User Data</button_1.Button>
                        <button_1.Button variant="secondary" className="w-full justify-start"><lucide_react_1.FileClock className="mr-2"/> Trigger Replay Regeneration</button_1.Button>
                    </card_1.CardContent>
                </card_1.Card>
            </tabs_1.TabsContent>

          </tabs_1.Tabs>
        </div>

        <sheet_1.SheetFooter>
          <sheet_1.SheetClose asChild>
            <button_1.Button variant="outline">Close</button_1.Button>
          </sheet_1.SheetClose>
        </sheet_1.SheetFooter>
      </sheet_1.SheetContent>
    </sheet_1.Sheet>);
}
