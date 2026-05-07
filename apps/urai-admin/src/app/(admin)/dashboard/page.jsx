import Card from '@/components/ui/card';
export default function DashboardPage() {
    var handleSaveState = function () {
        var canvasState = {
            // In a real application, you would get the canvas state here.
            // For now, we'll just use a placeholder object.
            scene: {
                width: 800,
                height: 600,
                elements: [
                    { id: 'rect1', type: 'rectangle', x: 50, y: 50, width: 100, height: 100, fill: 'red' },
                    { id: 'circle1', type: 'circle', x: 200, y: 150, radius: 50, fill: 'blue' },
                ],
            },
        };
        // Use the writeFile tool to save the state to a file.
        default_api.write_file({
            path: 'canvas-state.json',
            content: JSON.stringify(canvasState, null, 2),
        });
    };
    return (<div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card title="Total Users" value="1,234" icon={<span>👤</span>}/>
        <Card title="Recent Jobs" value="56" icon={<span>💼</span>}/>
        <Card title="Recent Content Items" value="12" icon={<span>📄</span>}/>
        <Card title="24h Job Failures" value="3" icon={<span>❌</span>}/>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">System Health</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Last Error Logs</h3>
          <div className="text-sm text-gray-700">
            <p>No errors reported in the last 24 hours.</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <button onClick={handleSaveState} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save State
        </button>
      </div>
    </div>);
}
