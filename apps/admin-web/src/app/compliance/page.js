"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompliancePage;
var ComplianceTools_1 = require("../../components/ComplianceTools");
function CompliancePage() {
    return (<div>
      <h1 className="text-2xl font-semibold">Export & Compliance Tools</h1>
      <p className="text-zinc-500">Manage user data exports and compliance with privacy regulations.</p>
      <ComplianceTools_1.default />
    </div>);
}
