'use client';
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var table_1 = require("@/components/ui/table");
var lucide_react_1 = require("lucide-react");
var withAuth_1 = require("@/components/withAuth");
var react_1 = require("react");
var initialConfigs = [
    { key: 'API_THROTTLE_RATE', value: '100/min' },
    { key: 'TIMELINE_GENERATION_TIMEOUT', value: '30000' },
    { key: 'AI_CONFIDENCE_THRESHOLD', value: '0.85' },
    { key: 'ASSET_FACTORY_ENDPOINT', value: '*****************' }, // Masked
];
function ConfigurationsPage() {
    var _a = (0, react_1.useState)(initialConfigs), configs = _a[0], setConfigs = _a[1];
    var _b = (0, react_1.useState)(''), newKey = _b[0], setNewKey = _b[1];
    var _c = (0, react_1.useState)(''), newValue = _c[0], setNewValue = _c[1];
    var handleAddConfig = function () {
        if (newKey && newValue) {
            setConfigs(__spreadArray(__spreadArray([], configs, true), [{ key: newKey, value: newValue }], false));
            setNewKey('');
            setNewValue('');
        }
    };
    return (<div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">System Configurations</h1>
      <card_1.Card className="bg-gray-800/50 border-gray-700 text-white">
        <card_1.CardHeader>
            <card_1.CardTitle>Environment & Feature Variables</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <table_1.Table>
            <table_1.TableHeader>
              <table_1.TableRow className="border-gray-700">
                <table_1.TableHead className="text-gray-400">Key</table_1.TableHead>
                <table_1.TableHead className="text-gray-400">Value</table_1.TableHead>
                <table_1.TableHead className="w-[100px] text-gray-400">Actions</table_1.TableHead>
              </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
              {configs.map(function (config, index) { return (<table_1.TableRow key={index} className="border-gray-700">
                  <table_1.TableCell><input_1.Input defaultValue={config.key} className="bg-gray-900 border-gray-700"/></table_1.TableCell>
                  <table_1.TableCell><input_1.Input defaultValue={config.value} className="bg-gray-900 border-gray-700"/></table_1.TableCell>
                  <table_1.TableCell className="text-right">
                    <button_1.Button variant="ghost" size="icon"><lucide_react_1.Save className="h-4 w-4 text-green-400"/></button_1.Button>
                    <button_1.Button variant="ghost" size="icon"><lucide_react_1.Trash2 className="h-4 w-4 text-red-500"/></button_1.Button>
                  </table_1.TableCell>
                </table_1.TableRow>); })}
                <table_1.TableRow className="border-gray-700">
                    <table_1.TableCell><input_1.Input placeholder="New Key" value={newKey} onChange={function (e) { return setNewKey(e.target.value); }} className="bg-gray-900 border-gray-700"/></table_1.TableCell>
                    <table_1.TableCell><input_1.Input placeholder="New Value" value={newValue} onChange={function (e) { return setNewValue(e.target.value); }} className="bg-gray-900 border-gray-700"/></table_1.TableCell>
                    <table_1.TableCell>
                        <button_1.Button onClick={handleAddConfig}><lucide_react_1.PlusCircle className="mr-2 h-4 w-4"/> Add</button_1.Button>
                    </table_1.TableCell>
                </table_1.TableRow>
            </table_1.TableBody>
          </table_1.Table>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
exports.default = (0, withAuth_1.default)(ConfigurationsPage, ['super_admin', 'admin']);
