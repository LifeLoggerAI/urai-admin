'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var switch_1 = require("@/components/ui/switch");
var alert_1 = require("@/components/ui/alert");
var lucide_react_1 = require("lucide-react");
var withAuth_1 = require("@/components/withAuth");
var initialSwitches = {
    global_feature_kill: {
        name: 'Global Feature Kill Switch',
        description: 'Disables all non-essential features system-wide. The core experience will remain active.',
        active: false,
        icon: <lucide_react_1.Power className="text-red-400"/>
    },
    ai_system_disable: {
        name: 'AI System Disable',
        description: 'Pauses all AI-driven insights, analysis, and content generation.',
        active: false,
        icon: <lucide_react_1.Bot className="text-yellow-400"/>
    },
    narrator_mute: {
        name: 'Narrator Mute',
        description: 'Disables the AI narrator voice synthesis across all surfaces.',
        active: false,
        icon: <lucide_react_1.Ear className="text-blue-400"/>
    },
    data_ingestion_pause: {
        name: 'Data Ingestion Pause',
        description: 'Stops the processing of all incoming passive signals and user data.',
        active: false,
        icon: <lucide_react_1.Database className="text-green-400"/>
    },
};
function KillSwitchesPage() {
    var _a = (0, react_1.useState)(initialSwitches), switches = _a[0], setSwitches = _a[1];
    var handleToggle = function (key) {
        // In a real app, you would show a confirmation modal here!
        setSwitches(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = __assign(__assign({}, prev[key]), { active: !prev[key].active }), _a)));
        });
    };
    return (<div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">System Failsafes & Kill Switches</h1>
      
      <alert_1.Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-700 text-red-300">
          <lucide_react_1.ShieldAlert className="h-4 w-4 !text-red-300"/>
          <alert_1.AlertTitle>Extreme Caution Advised</alert_1.AlertTitle>
          <alert_1.AlertDescription>
            These controls can disable major parts of the URAI system instantly. Only use them in a critical emergency. All actions are logged.
          </alert_1.AlertDescription>
      </alert_1.Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(switches).map(function (_a) {
            var key = _a[0], details = _a[1];
            return (<card_1.Card key={key} className={"bg-gray-800/50 border-gray-700 text-white ".concat(details.active ? 'border-red-500' : '')}>
            <card_1.CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    {details.icon}
                    <card_1.CardTitle>{details.name}</card_1.CardTitle>
                </div>
                <switch_1.Switch checked={details.active} onCheckedChange={function () { return handleToggle(key); }} className="data-[state=checked]:bg-red-500"/>
              </div>
            </card_1.CardHeader>
            <card_1.CardContent>
              <p className="text-gray-400">{details.description}</p>
              {details.active && (<p className="text-red-400 font-bold mt-2">This system is currently DISABLED.</p>)}
            </card_1.CardContent>
          </card_1.Card>);
        })}
      </div>
    </div>);
}
exports.default = (0, withAuth_1.default)(KillSwitchesPage, ['super_admin']);
