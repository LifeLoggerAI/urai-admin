'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: lucide_react_1.Home },
    { href: '/admin/users', label: 'Users', icon: lucide_react_1.Users },
    { href: '/admin/tenants', label: 'Tenants', icon: lucide_react_1.Briefcase },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: lucide_react_1.FileText },
    { href: '/admin/settings', label: 'Settings', icon: lucide_react_1.Settings },
];
function Sidebar() {
    var pathname = (0, navigation_1.usePathname)();
    return (<aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex-shrink-0">
      <div className="p-6 text-2xl font-bold text-center">URAI</div>
      <nav className="mt-6">
        <ul>
          {navItems.map(function (item) { return (<li key={item.label} className="px-4 py-2">
              <link_1.default href={item.href} className={(0, utils_1.cn)('flex items-center p-2 rounded-lg transition-colors', pathname.startsWith(item.href)
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700')}>
                <item.icon className="w-5 h-5 mr-3"/>
                {item.label}
              </link_1.default>
            </li>); })}
        </ul>
      </nav>
    </aside>);
}
