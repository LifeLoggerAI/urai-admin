
import React from "react";

const AssetFactory = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Asset Factory / Renders</h1>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Filter by user"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Filter by run"
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Render ID</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Run ID</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Preview</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">render-123</td>
            <td className="border px-4 py-2">user-abc</td>
            <td className="border px-4 py-2">run-xyz</td>
            <td className="border px-4 py-2">failed</td>
            <td className="border px-4 py-2">
              <a href="#" className="text-blue-500 hover:underline">Link</a>
            </td>
            <td className="border px-4 py-2">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Cleanup
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AssetFactory;
