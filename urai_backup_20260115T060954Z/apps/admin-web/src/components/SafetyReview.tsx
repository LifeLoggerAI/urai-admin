
const insights = [
    { id: 'insight-1', content: 'User expressed feelings of hopelessness.', status: 'Pending' },
    { id: 'insight-2', content: 'User mentioned a desire to self-harm.', status: 'Flagged' },
  ];
  
  export default function SafetyReview() {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Content & Insight Safety Review</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-zinc-500 dark:text-zinc-400">
              <th className="p-2">Insight ID</th>
              <th className="p-2">Content (Anonymized)</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {insights.map(insight => (
              <tr key={insight.id} className="border-t dark:border-zinc-800">
                <td className="p-2">{insight.id}</td>
                <td className="p-2">{insight.content}</td>
                <td className="p-2">{insight.status}</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
