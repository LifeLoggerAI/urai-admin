"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SafetyPage;
var SafetyReview_1 = require("../../components/SafetyReview");
function SafetyPage() {
    return (<div>
      <h1 className="text-2xl font-semibold">Content & Insight Safety Review</h1>
      <p className="text-zinc-500">Review and manage flagged content.</p>
      <SafetyReview_1.default />
    </div>);
}
