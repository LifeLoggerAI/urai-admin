'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Construction, Trash2, SearchCheck, HeartPulse } from "lucide-react";
import withAuth from '@/components/withAuth';

function MaintenancePage() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('The system is currently down for maintenance. We will be back shortly.');

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">System Maintenance & Failsafes</h1>
      
      <Card className="mb-6 bg-red-900/50 border-red-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldAlert className="mr-2"/> Global Maintenance Mode</CardTitle>
          <CardDescription>When activated, all non-admin access to URAI systems will be blocked and the maintenance message will be displayed.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Switch 
              id="maintenance-mode" 
              checked={isMaintenanceMode} 
              onCheckedChange={setIsMaintenanceMode} 
              className="data-[state=checked]:bg-red-500"
            />
            <label htmlFor="maintenance-mode" className="text-lg font-medium">
              {isMaintenanceMode ? 'Maintenance Mode ACTIVE' : 'Maintenance Mode INACTIVE'}
            </label>
          </div>
          {isMaintenanceMode && (
            <Alert className="bg-red-900/70 border-red-600">
                <AlertTitle>Warning!</AlertTitle>
                <AlertDescription>The system is now in maintenance mode. All public access is disabled.</AlertDescription>
            </Alert>
          )}
          <div className="mt-4">
              <label htmlFor="maintenance-message" className="block mb-2 text-sm font-medium">Custom Maintenance Message</label>
              <Input 
                id="maintenance-message"
                value={maintenanceMessage} 
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                className="bg-gray-900 border-gray-700"
              />
          </div>
           <Button className="mt-4 bg-red-600 hover:bg-red-700">Update Maintenance Status</Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center"><Construction className="mr-2"/> System Actions</CardTitle>
          <CardDescription>Perform critical system-wide actions. Use with caution.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 flex-col h-24">
                <Trash2 className="h-6 w-6 mb-2" />
                Clear Application Cache
            </Button>
             <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 flex-col h-24">
                <SearchCheck className="h-6 w-6 mb-2" />
                Rebuild Search Index
            </Button>
             <Button variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 flex-col h-24">
                <HeartPulse className="h-6 w-6 mb-2" />
                Run Full Health Check
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}

export default withAuth(MaintenancePage, ['super_admin']);
