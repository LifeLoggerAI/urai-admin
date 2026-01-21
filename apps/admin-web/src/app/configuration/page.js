"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConfigurationPage;
var SystemConfiguration_1 = require("../../components/SystemConfiguration");
function ConfigurationPage() {
    return (<div>
      <h1 className="text-2xl font-semibold">System Configuration Center</h1>
      <p className="text-zinc-500">Manage system-wide settings and feature flags.</p>
      <SystemConfiguration_1.default />
    </div>);
}
