'use client';

import React from 'react';

interface EventsTableProps {
  data: Record<string, number>;
}

export const EventsTable: React.FC<EventsTableProps> = ({ data }) => {
  if (Object.keys(data).length === 0) {
    return <p className="text-gray-500">No event data for this day.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Event Breakdown</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-2 font-semibold">Event Name</th>
            <th className="pb-2 font-semibold">Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).sort(([, a], [, b]) => b - a).map(([name, count]) => (
            <tr key={name} className="border-b last:border-none">
              <td className="py-2">{name}</td>
              <td className="py-2">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
