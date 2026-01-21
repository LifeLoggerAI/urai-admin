
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, CheckCircle } from 'lucide-react';

const AISystemsStatus = () => {
    const onlineSystems = 8;
    const totalSystems = 8;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Systems</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{onlineSystems}/{totalSystems} Online</div>
                <div className="flex items-center text-sm text-green-500">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>All systems operational</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default AISystemsStatus;
