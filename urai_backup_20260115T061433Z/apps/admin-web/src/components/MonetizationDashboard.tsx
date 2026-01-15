
const monetizationMetrics = [
    { name: 'Active Subscriptions', value: '1,234' },
    { name: 'Conversion Rate', value: '5.6%' },
    { name: 'Monthly Recurring Revenue', value: '$12,345' },
  ];
  
  export default function MonetizationDashboard() {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Monetization & Licensing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {monetizationMetrics.map(metric => (
            <div key={metric.name} className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{metric.name}</div>
              <div className="text-2xl font-semibold">{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
