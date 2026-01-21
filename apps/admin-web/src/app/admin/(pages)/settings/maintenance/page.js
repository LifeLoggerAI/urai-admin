'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var switch_1 = require("@/components/ui/switch");
var alert_1 = require("@/components/ui/alert");
var lucide_react_1 = require("lucide-react");
var withAuth_1 = require("@/components/withAuth");
function MaintenancePage() {
    var _a = (0, react_1.useState)(false), isMaintenanceMode = _a[0], setIsMaintenanceMode = _a[1];
    var _b = (0, react_1.useState)('The system is currently down for maintenance. We will be back shortly.'), maintenanceMessage = _b[0], setMaintenanceMessage = _b[1];
    return (<div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">System Maintenance & Failsafes</h1>
      
      <card_1.Card className="mb-6 bg-red-900/50 border-red-700 text-white">
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center"><lucide_react_1.ShieldAlert className="mr-2"/> Global Maintenance Mode</card_1.CardTitle>
          <card_1.CardDescription>When activated, all non-admin access to URAI systems will be blocked and the maintenance message will be displayed.</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <switch_1.Switch id="maintenance-mode" checked={isMaintenanceMode} onCheckedChange={setIsMaintenanceMode} className="data-[state=checked]:bg-red-500"/>
            <label htmlFor="maintenance-mode" className="text-lg font-medium">
              {isMaintenanceMode ? 'Maintenance Mode ACTIVE' : 'Maintenance Mode INACTIVE'}
            </label>
          </div>
          {isMaintenanceMode && (<alert_1.Alert className="bg-red-900/70 border-red-600">
                <alert_1.AlertTitle>Warning!</alert_1.AlertTitle>
                <alert_1.AlertDescription>The system is now in maintenance mode. All public access is disabled.</alert_1.AlertDescription>
            </alert_1.Alert>)}
          <div className="mt-4">
              <label htmlFor="maintenance-message" className="block mb-2 text-sm font-medium">Custom Maintenance Message</label>
              <input_1.Input id="maintenance-message" value={maintenanceMessage} onChange={function (e) { return setMaintenanceMessage(e.target.value); }} className="bg-gray-900 border-gray-700"/>
          </div>
           <button_1.Button className="mt-4 bg-red-600 hover:bg-red-700">Update Maintenance Status</button_1.Button>
        </card_1.CardContent>
      </card_1.Card>

      <card_1.Card className="bg-gray-800/50 border-gray-700 text-white">
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center"><lucide_react_1.Construction className="mr-2"/> System Actions</card_1.CardTitle>
          <card_1.CardDescription>Perform critical system-wide actions. Use with caution.</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button_1.Button variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 flex-col h-24">
                <lucide_react_1.Trash2 className="h-6 w-6 mb-2"/>
                Clear Application Cache
            </button_1.Button>
             <button_1.Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 flex-col h-24">
                <lucide_react_1.SearchCheck className="h-6 w-6 mb-2"/>
                Rebuild Search Index
            </button_1.Button>
             <button_1.Button variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 flex-col h-24">
                <lucide_react_1.HeartPulse className="h-6 w-6 mb-2"/>
                Run Full Health Check
            </button_1.Button>
        </card_1.CardContent>
      </card_1.Card>

    </div>);
}
exports.default = (0, withAuth_1.default)(MaintenancePage, ['super_admin']);
