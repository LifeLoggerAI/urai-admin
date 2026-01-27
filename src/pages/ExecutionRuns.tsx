
import React from "react";

const ExecutionRuns = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Execution Runs</h1>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Filter by status"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Filter by intent"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Filter by version"
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Run ID</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Intent</th>
            <th className="px-4 py-2">Version</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">run-123</td>
            <td className="border px-4 py-2">completed</td>
            <td className="border px-4 py-2">render-image</td>
            <td className="border px-4 py-2">1.0.0</td>
            <td className="border px-4 py-2">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExecutionRuns;
