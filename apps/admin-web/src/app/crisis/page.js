"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CrisisPage;
var CrisisTools_1 = require("../../components/CrisisTools");
function CrisisPage() {
    return (<div>
      <h1 className="text-2xl font-semibold">Incident & Crisis Tools</h1>
      <p className="text-zinc-500">Manage system-wide incidents and crisis situations.</p>
      <CrisisTools_1.default />
    </div>);
}
