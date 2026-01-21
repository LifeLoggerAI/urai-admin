"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SystemConfiguration;
var configs = [
    { id: 'config-1', key: 'threshold.sentiment', value: '0.85', description: 'Sentiment analysis threshold' },
    { id: 'config-2', key: 'feature.narrator.enabled', value: 'true', description: 'Enable/disable the narrator feature' },
];
function SystemConfiguration() {
    return (<div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">System Configuration</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-zinc-500 dark:text-zinc-400">
              <th className="p-2">Key</th>
              <th className="p-2">Value</th>
              <th className="p-2">Description</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {configs.map(function (config) { return (<tr key={config.id} className="border-t dark:border-zinc-800">
                <td className="p-2 font-mono">{config.key}</td>
                <td className="p-2 font-mono">{config.value}</td>
                <td className="p-2">{config.description}</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">Edit</button>
                </td>
              </tr>); })}
          </tbody>
        </table>
      </div>);
}
