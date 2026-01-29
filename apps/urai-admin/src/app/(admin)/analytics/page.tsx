
'use client';

import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AnalyticsDashboard = () => {
  const { data, error } = useSWR('/api/analytics', fetcher);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Events</CardTitle>
        </CardHeader>
        <CardContent>
          {data &&
            Object.entries(data.topEvents).map(([name, count]) => (
              <div key={name} className="flex justify-between">
                <span>{name}</span>
                <span>{count}</span>
              </div>
            ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Routes</CardTitle>
        </CardHeader>
        <CardContent>
          {data &&
            Object.entries(data.topRoutes).map(([name, count]) => (
              <div key={name} className="flex justify-between">
                <span>{name}</span>
                <span>{count}</span>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
