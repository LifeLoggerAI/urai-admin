"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IncidentPage;
var IncidentTools_1 = require("../../components/IncidentTools");
function IncidentPage() {
    return (<div>
      <h1 className="text-2xl font-semibold">Incident & Crisis Tools</h1>
      <p className="text-zinc-500">Manage system-wide incidents and crisis situations.</p>
      <IncidentTools_1.default />
    </div>);
}
