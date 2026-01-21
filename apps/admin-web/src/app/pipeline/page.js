"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PipelinePage;
var PipelineDashboard_1 = require("../../components/PipelineDashboard");
function PipelinePage() {
    return (<div>
      <h1 className="text-2xl font-semibold">Data Pipeline & Ingestion Monitoring</h1>
      <p className="text-zinc-500">Monitor the health and performance of the URAI data pipeline.</p>
      <PipelineDashboard_1.default />
    </div>);
}
