
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, AlertTriangle } from 'lucide-react';

const JobsSummary = () => {
    const runningJobs = 125;
    const failedJobs = 3;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{runningJobs} Running</div>
                <div className="flex items-center text-sm text-red-500">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>{failedJobs} Failed</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default JobsSummary;
