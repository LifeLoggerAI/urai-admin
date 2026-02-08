'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HealthPage() {
  const [statuses, setStatuses] = useState({
    database: 'OK',
    authentication: 'OK',
    storage: 'OK',
  });

  const refreshStatuses = () => {
    // In a real application, you would fetch the statuses from your services
    setStatuses({
      database: 'OK',
      authentication: 'OK',
      storage: 'OK',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">System Health</h1>
        <Button onClick={refreshStatuses}>Refresh</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Database</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={statuses.database === 'OK' ? 'text-green-500' : 'text-red-500'}>
              {statuses.database}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={statuses.authentication === 'OK' ? 'text-green-500' : 'text-red-500'}>
              {statuses.authentication}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={statuses.storage === 'OK' ? 'text-green-500' : 'text-red-500'}>
              {statuses.storage}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
