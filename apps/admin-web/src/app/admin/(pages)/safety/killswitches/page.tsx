
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Power, Bot, Ear, Database, ShieldAlert } from "lucide-react";
import withAuth from '@/components/withAuth';

const initialSwitches = {
  global_feature_kill: { 
    name: 'Global Feature Kill Switch',
    description: 'Disables all non-essential features system-wide. The core experience will remain active.',
    active: false, 
    icon: <Power className="text-red-400"/> 
  },
  ai_system_disable: { 
    name: 'AI System Disable', 
    description: 'Pauses all AI-driven insights, analysis, and content generation.', 
    active: false, 
    icon: <Bot className="text-yellow-400"/> 
  },
  narrator_mute: { 
    name: 'Narrator Mute', 
    description: 'Disables the AI narrator voice synthesis across all surfaces.', 
    active: false, 
    icon: <Ear className="text-blue-400"/> 
  },
  data_ingestion_pause: { 
    name: 'Data Ingestion Pause', 
    description: 'Stops the processing of all incoming passive signals and user data.', 
    active: false, 
    icon: <Database className="text-green-400"/> 
  },
};

function KillSwitchesPage() {
  const [switches, setSwitches] = useState(initialSwitches);

  const handleToggle = (key: keyof typeof initialSwitches) => {
    // In a real app, you would show a confirmation modal here!
    setSwitches(prev => ({ ...prev, [key]: { ...prev[key], active: !prev[key].active } }));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">System Failsafes & Kill Switches</h1>
      
      <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-700 text-red-300">
          <ShieldAlert className="h-4 w-4 !text-red-300"/>
          <AlertTitle>Extreme Caution Advised</AlertTitle>
          <AlertDescription>
            These controls can disable major parts of the URAI system instantly. Only use them in a critical emergency. All actions are logged.
          </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(switches).map(([key, details]) => (
          <Card key={key} className={`bg-gray-800/50 border-gray-700 text-white ${details.active ? 'border-red-500' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    {details.icon}
                    <CardTitle>{details.name}</CardTitle>
                </div>
                <Switch
                  checked={details.active}
                  onCheckedChange={() => handleToggle(key as keyof typeof initialSwitches)}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">{details.description}</p>
              {details.active && (
                 <p className="text-red-400 font-bold mt-2">This system is currently DISABLED.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default withAuth(KillSwitchesPage, ['super_admin']);
