"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserTable;
var dummy_users_1 = require("../lib/dummy-users");
function UserTable() {
    return (<div className="mt-4">
      <table className="w-full text-left">
        <thead>
          <tr className="text-zinc-500 dark:text-zinc-400">
            <th className="p-2">User ID</th>
            <th className="p-2">Status</th>
            <th className="p-2">Subscription</th>
            <th className="p-2">Devices</th>
            <th className="p-2">Last Activity</th>
            <th className="p-2">Risk Flags</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dummy_users_1.dummyUsers.map(function (user) { return (<tr key={user.id} className="border-t dark:border-zinc-800">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.status}</td>
              <td className="p-2">{user.subscriptionTier}</td>
              <td className="p-2">{user.deviceCount}</td>
              <td className="p-2">{new Date(user.lastActivity).toLocaleString()}</td>
              <td className="p-2">{user.riskFlags}</td>
              <td className="p-2">
                <button className="text-blue-500 hover:underline">View</button>
              </td>
            </tr>); })}
        </tbody>
      </table>
    </div>);
}
