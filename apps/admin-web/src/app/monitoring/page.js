"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MonitoringPage;
var PipelineHealth_1 = require("../../components/PipelineHealth");
function MonitoringPage() {
    return (<div>
      <h1 className="text-2xl font-semibold">Data Pipeline & Ingestion Monitoring</h1>
      <p className="text-zinc-500">Monitor the health of the URAI data pipeline.</p>
      <PipelineHealth_1.default />
    </div>);
}
