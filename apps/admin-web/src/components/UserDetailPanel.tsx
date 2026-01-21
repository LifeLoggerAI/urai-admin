'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from 'firebase/auth';
import { ShieldAlert, Smartphone, FileText, ToggleRight, BarChart, Clock } from 'lucide-react';

// This is a placeholder for the actual user data structure we'll get from Firestore
interface UraiUser extends User {
    customClaims?: {
        role: 'super_admin' | 'admin' | 'analyst' | 'moderator' | 'support' | 'viewer';
    };
    devices?: any[];
    consentTiers?: any;
    featureFlags?: any;
    mentalLoadScores?: any;
    shadowMetrics?: any;
    archetypeState?: any;
    timelineHealth?: any;
}


interface UserDetailPanelProps {
  user: UraiUser | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function UserDetailPanel({ user, isOpen, onOpenChange }: UserDetailPanelProps) {
  if (!user) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[80vw] sm:w-[50vw] bg-gray-900 border-gray-800 text-white">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-white">
            User: {user.displayName || user.email}
          </SheetTitle>
          <SheetDescription>
            ID: {user.uid} - Role: <span className="font-bold">{user.customClaims?.role.toUpperCase()}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-gray-800">
                    <TabsTrigger value="profile"><FileText className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
                    <TabsTrigger value="devices"><Smartphone className="w-4 h-4 mr-2" /> Devices</TabsTrigger>
                    <TabsTrigger value="consent"><ShieldAlert className="w-4 h-4 mr-2" /> Consent</TabsTrigger>
                    <TabsTrigger value="flags"><ToggleRight className="w-4 h-4 mr-2" /> Flags</TabsTrigger>
                    <TabsTrigger value="metrics"><BarChart className="w-4 h-4 mr-2" /> Metrics</TabsTrigger>
                    <TabsTrigger value="timeline"><Clock className="w-4 h-4 mr-2" /> Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="p-4 bg-gray-800/50 rounded-b-lg">
                    <p>User profile details will go here.</p>
                </TabsContent>

                <TabsContent value="devices" className="p-4 bg-gray-800/50 rounded-b-lg">
                    <p>User device information will go here.</p>
                </TabsContent>
                
                <TabsContent value="consent" className="p-4 bg-gray-800/50 rounded-b-lg">
                    <p>Consent tier information will go here.</p>
                </TabsContent>

                <TabsContent value="flags" className="p-4 bg-gray-800/50 rounded-b-lg">
                    <p>User-specific feature flags will be displayed here.</p>
                </TabsContent>
                
                <TabsContent value="metrics" className="p-4 bg-gray-800/50 rounded-b-lg">
                    <p>Shadow metrics, mental load scores, and archetype state.</p>
                </TabsContent>

                <TabsContent value="timeline" className="p-4 bg-gray-800/50 rounded-b-lg">
                    <p>Timeline health and regeneration tools will be here.</p>
                </TabsContent>
            </Tabs>
        </div>

        <SheetFooter className="mt-6">
          <div className="flex w-full justify-between">
            <div>
              <Button variant="destructive">Suspend User</Button>
              <Button variant="outline" className="ml-2">Shadow-ban</Button>
            </div>
            <SheetClose asChild>
              <Button variant="secondary">Close</Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
