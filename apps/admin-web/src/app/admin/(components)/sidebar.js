'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
var react_1 = require("react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var navItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: lucide_react_1.LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: lucide_react_1.Users },
    {
        name: 'Data & Signals',
        icon: lucide_react_1.Database,
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
        icon: lucide_react_1.BrainCircuit,
        subItems: [
            { name: 'Model Registry', href: '/admin/ai/registry' },
            { name: 'Drift Detection', href: '/admin/ai/drift' },
            { name: 'Explainability', href: '/admin/ai/explainability' },
            { name: 'Overrides', href: '/admin/ai/overrides' },
        ],
    },
    {
        name: 'Timeline & Memory',
        icon: lucide_react_1.History,
        subItems: [
            { name: 'Integrity Checks', href: '/admin/timeline/integrity' },
            { name: 'Memory Health', href: '/admin/timeline/memory' },
            { name: 'Regeneration', href: '/admin/timeline/regeneration' },
        ]
    },
    {
        name: 'Jobs & Pipelines',
        icon: lucide_react_1.Workflow,
        subItems: [
            { name: 'Job Queue', href: '/admin/jobs/queue' },
            { name: 'Schedulers', href: '/admin/jobs/schedulers' },
            { name: 'Render Pipelines', href: '/admin/jobs/renders' },
        ]
    },
    {
        name: 'Monetization',
        icon: lucide_react_1.Store,
        subItems: [
            { name: 'Marketplace', href: '/admin/monetization/marketplace' },
            { name: 'Revenue', href: '/admin/monetization/revenue' },
            { name: 'Payouts', href: '/admin/monetization/payouts' },
        ]
    },
    {
        name: 'Safety & Ethics',
        icon: lucide_react_1.Shield,
        subItems: [
            { name: 'Crisis Logs', href: '/admin/safety/crisis' },
            { name: 'Abuse Reports', href: '/admin/safety/reports' },
            { name: 'Kill Switches', href: '/admin/safety/kill-switches' },
        ]
    },
    {
        name: 'Experiments',
        icon: lucide_react_1.FlaskConical,
        subItems: [
            { name: 'Feature Flags', href: '/admin/experiments/flags' },
            { name: 'A/B Tests', href: '/admin/experiments/tests' },
        ]
    },
    {
        name: 'System Settings',
        icon: lucide_react_1.Settings,
        subItems: [
            { name: 'Admin Management', href: '/admin/settings/admins' },
            { name: 'Configurations', href: '/admin/settings/configs' },
            { name: 'Maintenance', href: '/admin/settings/maintenance' },
        ]
    },
];
var NavItem = function (_a) {
    var item = _a.item;
    var pathname = (0, navigation_1.usePathname)();
    // Default open if the current path is a sub-item of this nav item
    var isParentActive = item.subItems && item.subItems.some(function (sub) { return pathname.startsWith(sub.href); });
    var _b = (0, react_1.useState)(isParentActive), isOpen = _b[0], setIsOpen = _b[1];
    if (item.subItems) {
        return (<div>
                <button onClick={function () { return setIsOpen(!isOpen); }} className={"w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-700 ".concat(isParentActive ? 'bg-gray-800' : '')}>
                     <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3"/>
                        <span>{item.name}</span>
                    </div>
                    <lucide_react_1.ChevronDown className={"h-4 w-4 transition-transform ".concat(isOpen ? 'rotate-180' : '')}/>
                </button>
                {isOpen && (<div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-4">
                        {item.subItems.map(function (subItem) { return (<link_1.default key={subItem.name} href={subItem.href}>
                                <div className={"block p-2 rounded-md text-sm ".concat(pathname === subItem.href ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white')}>
                                    {subItem.name}
                                </div>
                            </link_1.default>); })}
                    </div>)}
            </div>);
    }
    return (<link_1.default href={item.href}>
            <div className={"flex items-center p-2 rounded-md ".concat(pathname === item.href ? 'bg-gray-800' : 'hover:bg-gray-700')}>
                <item.icon className="h-5 w-5 mr-3"/>
                <span>{item.name}</span>
            </div>
        </link_1.default>);
};
function Sidebar() {
    return (<aside className="w-64 bg-black text-gray-300 p-4 flex flex-col h-screen">
        <div className="text-2xl font-bold mb-6 text-white pl-2">URAI-ADMIN</div>
        <nav className="space-y-2 flex-grow">
            {navItems.map(function (item) { return <NavItem key={item.name} item={item}/>; })}
        </nav>
    </aside>);
}
