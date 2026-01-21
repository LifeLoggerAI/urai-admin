'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AccessDeniedPage;
var lucide_react_1 = require("lucide-react");
var link_1 = require("next/link");
function AccessDeniedPage() {
    return (<div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <lucide_react_1.ShieldAlert className="h-16 w-16 text-red-500 mb-4"/>
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <p className="text-lg text-gray-400 mb-8">You do not have the required permissions to view this page.</p>
      <link_1.default href="/admin/dashboard">
        <div className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          Return to Dashboard
        </div>
      </link_1.default>
    </div>);
}
