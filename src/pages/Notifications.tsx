
import React from "react";

const Notifications = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Log ID</th>
            <th className="px-4 py-2">Provider</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">log-123</td>
            <td className="border px-4 py-2">sendgrid</td>
            <td className="border px-4 py-2">delivered</td>
            <td className="border px-4 py-2">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Retry
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Notifications;
