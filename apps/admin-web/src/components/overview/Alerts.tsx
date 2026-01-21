
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

const alerts = [
    { id: 1, message: "High memory usage on timeline-service", level: "warning" },
    { id: 2, message: "Failed to process 50 video uploads", level: "critical" },
    { id: 3, message: "Stale data detected in signal-processor", level: "warning" },
];

const Alerts = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts & Warnings</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-2">
                    {alerts.map(alert => (
                        <div key={alert.id} className="flex items-start">
                            <AlertTriangle className={`h-4 w-4 mr-2 mt-1 ${alert.level === 'critical' ? 'text-red-500' : 'text-yellow-500'}`} />
                            <p className="text-sm">{alert.message}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default Alerts;
