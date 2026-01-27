
import React from "react";

const Content = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Content / Templates</h1>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Template ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Version</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">template-123</td>
            <td className="border px-4 py-2">Film Noir</td>
            <td className="border px-4 py-2">1.0.0</td>
            <td className="border px-4 py-2">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Edit
              </button>
              <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                History
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Content;
