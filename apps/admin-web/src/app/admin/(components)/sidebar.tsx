
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    ChevronDown, 
    LayoutDashboard, 
    Users, 
    Database, 
    BrainCircuit, 
    History, 
    Workflow, 
    Store, 
    Shield, 
    FlaskConical, 
    Settings 
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  {
    name: 'Data & Signals',
    icon: Database,
    subItems: [
      { name: 'Ingestion Status', href: '/admin/data/ingestion' },
      { name: 'Obscura Patterns', href: '/admin/data/patterns' },
      { name: 'Shadow Cognition', href: '/admin/data/cognition' },
      { name: 'Inference Health', href: '/admin/data/inference' },
      { name: 'Schema Dashboards', href: '/admin/data/schemas' },
    ],
  },
  {
    name: 'AI & Intelligence',
    icon: BrainCircuit,
    subItems: [
      { name: 'Model Registry', href: '/admin/ai/registry' },
      { name: 'Drift Detection', href: '/admin/ai/drift' },
      { name: 'Explainability', href: '/admin/ai/explainability' },
      { name: 'Overrides', href: '/admin/ai/overrides' },
    ],
  },
  {
    name: 'Timeline & Memory',
    icon: History,
    subItems: [
        { name: 'Integrity Checks', href: '/admin/timeline/integrity' },
        { name: 'Memory Health', href: '/admin/timeline/memory' },
        { name: 'Regeneration', href: '/admin/timeline/regeneration' },
    ]
  },
  {
    name: 'Jobs & Pipelines',
    icon: Workflow,
    subItems: [
        { name: 'Job Queue', href: '/admin/jobs/queue' },
        { name: 'Schedulers', href: '/admin/jobs/schedulers' },
        { name: 'Render Pipelines', href: '/admin/jobs/renders' },
    ]
  },
  {
      name: 'Monetization',
      icon: Store,
      subItems: [
        { name: 'Marketplace', href: '/admin/monetization/marketplace' },
        { name: 'Revenue', href: '/admin/monetization/revenue' },
        { name: 'Payouts', href: '/admin/monetization/payouts' },
      ]
  },
  {
      name: 'Safety & Ethics',
      icon: Shield,
      subItems: [
        { name: 'Crisis Logs', href: '/admin/safety/crisis' },
        { name: 'Abuse Reports', href: '/admin/safety/reports' },
        { name: 'Kill Switches', href: '/admin/safety/kill-switches' },
      ]
  },
  {
      name: 'Experiments',
      icon: FlaskConical,
      subItems: [
        { name: 'Feature Flags', href: '/admin/experiments/flags' },
        { name: 'A/B Tests', href: '/admin/experiments/tests' },
      ]
  },
  {
    name: 'System Settings',
    icon: Settings,
    subItems: [
        { name: 'Admin Management', href: '/admin/settings/admins' },
        { name: 'Configurations', href: '/admin/settings/configs' },
        { name: 'Maintenance', href: '/admin/settings/maintenance' },
    ]
  },
];

const NavItem = ({ item }) => {
    const pathname = usePathname();
    // Default open if the current path is a sub-item of this nav item
    const isParentActive = item.subItems && item.subItems.some(sub => pathname.startsWith(sub.href));
    const [isOpen, setIsOpen] = useState(isParentActive);

    if (item.subItems) {
        return (
            <div>
                <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-700 ${isParentActive ? 'bg-gray-800' : ''}`}>
                     <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.name}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-4">
                        {item.subItems.map(subItem => (
                            <Link key={subItem.name} href={subItem.href}>
                                <div className={`block p-2 rounded-md text-sm ${pathname === subItem.href ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}>
                                    {subItem.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link href={item.href}>
            <div className={`flex items-center p-2 rounded-md ${pathname === item.href ? 'bg-gray-800' : 'hover:bg-gray-700'}`}>
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
            </div>
        </Link>
    );
};


export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-gray-300 p-4 flex flex-col h-screen">
        <div className="text-2xl font-bold mb-6 text-white pl-2">URAI-ADMIN</div>
        <nav className="space-y-2 flex-grow">
            {navItems.map(item => <NavItem key={item.name} item={item} />)}
        </nav>
    </aside>
  );
}
