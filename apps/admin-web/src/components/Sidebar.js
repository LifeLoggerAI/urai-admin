'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var links = [
    { href: '/', label: 'Dashboard' },
    { href: '/users', label: 'User Intelligence' },
    { href: '/pipeline', label: 'Data Pipeline' },
    { href: '/models', label: 'AI/Model Governance' },
    { href: '/safety', label: 'Content Safety' },
    { href: '/configuration', label: 'System Config' },
    { href: '/roles', label: 'Roles & Permissions' },
    { href: '/incident', label: 'Incident Tools' },
    { href: '/monetization', label: 'Monetization' },
    { href: '/compliance', label: 'Compliance' },
];
function Sidebar() {
    var pathname = (0, navigation_1.usePathname)();
    return (<div className="w-64 bg-zinc-100 dark:bg-zinc-900 p-4 border-r dark:border-zinc-800">
      <div className="text-2xl font-bold mb-4">URAI Admin</div>
      <nav>
        <ul>
          {links.map(function (link) { return (<li key={link.href}>
              <link_1.default href={link.href}>
                <p className={"p-2 rounded-lg ".concat(pathname === link.href ? 'bg-blue-500 text-white' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800')}>
                  {link.label}
                </p>
              </link_1.default>
            </li>); })}
        </ul>
      </nav>
    </div>);
}
