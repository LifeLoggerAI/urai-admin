
const insights = [
    { id: 'insight-1', type: 'Pattern Detected', content: 'User exhibits a recurring pattern of negative self-talk on weekends.', status: 'pending' },
    { id: 'insight-2', type: 'Crisis Alert', content: 'Potential crisis detected based on recent journal entries.', status: 'flagged' },
    { id: 'insight-3', type: 'Forecast', content: 'Forecasted increase in anxiety levels over the next 48 hours.', status: 'pending' },
  ];
  
  export default function InsightReviewQueue() {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Insight Review Queue</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-zinc-500 dark:text-zinc-400">
              <th className="p-2">Insight ID</th>
              <th className="p-2">Type</th>
              <th className="p-2">Content (Anonymized)</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {insights.map(insight => (
              <tr key={insight.id} className="border-t dark:border-zinc-800">
                <td className="p-2">{insight.id}</td>
                <td className="p-2">{insight.type}</td>
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
