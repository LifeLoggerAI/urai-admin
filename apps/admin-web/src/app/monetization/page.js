"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MonetizationPage;
var MonetizationDashboard_1 = require("../../components/MonetizationDashboard");
function MonetizationPage() {
    return (<div>
      <h1 className="text-2xl font-semibold">Monetization & Licensing Dashboard</h1>
      <p className="text-zinc-500">Track subscriptions, revenue, and growth metrics.</p>
      <MonetizationDashboard_1.default />
    </div>);
}
