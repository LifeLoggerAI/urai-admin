
import React from "react";

const Users = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email or UID"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">UID</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Flags</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">uid-123</td>
            <td className="border px-4 py-2">user@example.com</td>
            <td className="border px-4 py-2">jobsAllowed, xrAllowed</td>
            <td className="border px-4 py-2">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Users;
