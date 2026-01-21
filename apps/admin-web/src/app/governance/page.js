"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GovernancePage;
var ModelGovernance_1 = require("../../components/ModelGovernance");
function GovernancePage() {
    return (<div>
      <h1 className="text-2xl font-semibold">AI / Model Governance Panel</h1>
      <p className="text-zinc-500">Manage and control AI models and their configurations.</p>
      <ModelGovernance_1.default />
    </div>);
}
