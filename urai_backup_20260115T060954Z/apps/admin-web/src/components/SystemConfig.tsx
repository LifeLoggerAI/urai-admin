
const configs = [
    { key: 'threshold.narrator.confidence', value: '0.85' },
    { key: 'feature.seasonal.enabled', value: 'true' },
    { key: 'push.notification.cadence', value: 'daily' },
  ];
  
  export default function SystemConfig() {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">System Configuration</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-zinc-500 dark:text-zinc-400">
              <th className="p-2">Key</th>
              <th className="p-2">Value</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {configs.map(config => (
              <tr key={config.key} className="border-t dark:border-zinc-800">
                <td className="p-2">{config.key}</td>
                <td className="p-2">{config.value}</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
