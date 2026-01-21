"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminLayout;
var sidebar_1 = require("./(components)/sidebar");
function AdminLayout(_a) {
    var children = _a.children;
    return (<div className="flex h-screen bg-gray-900 text-white">
      <sidebar_1.default />
      <main className="flex-1 p-6 bg-gray-800 overflow-y-auto">
        {children}
      </main>
    </div>);
}
