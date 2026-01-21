"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelGovernance;
var models = [
    { id: 'model-1', name: 'Narrator v3.2', active: true, features: ['Narrator', 'Forecasts'] },
    { id: 'model-2', name: 'Crisis Predictor v1.1', active: false, features: ['Crisis Prediction'] },
];
function ModelGovernance() {
    return (<div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">AI/Model Governance</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-zinc-500 dark:text-zinc-400">
              <th className="p-2">Model ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Active</th>
              <th className="p-2">Features</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map(function (model) { return (<tr key={model.id} className="border-t dark:border-zinc-800">
                <td className="p-2">{model.id}</td>
                <td className="p-2">{model.name}</td>
                <td className="p-2">{model.active ? 'Yes' : 'No'}</td>
                <td className="p-2">{model.features.join(', ')}</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">Manage</button>
                </td>
              </tr>); })}
          </tbody>
        </table>
      </div>);
}
