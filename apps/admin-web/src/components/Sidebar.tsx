
'use client';

import { navItems } from '@/lib/nav-items';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

const Sidebar = () => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={cn(
            "relative min-w-[250px] border-r pr-4 pl-8 py-4 flex flex-col justify-between",
            isCollapsed && "min-w-[80px] pl-4"
        )}>
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className='absolute -right-4 top-8 p-2 rounded-full bg-background border border-border'>
                <ChevronLeft className={cn(
                    "h-4 w-4",
                    isCollapsed && "rotate-180"
                )} />
            </button>

            <div>
                <div className='font-bold text-2xl mb-8'>URAI</div>

                <div className="flex flex-col space-y-2">
                    {navItems.map((item, index) => (
                        <Link key={index} href={item.href} className={cn(
                            "flex items-center space-x-2 py-2 px-4 rounded-lg",
                            pathname === item.href && "bg-muted",
                            isCollapsed && "justify-center"
                        )}>
                            <item.icon className="h-5 w-5" />
                            {!isCollapsed && <span className="font-medium">{item.title}</span>}
                        </Link>
                    ))}
                </div>
            </div>

            {!isCollapsed && <div className='text-sm text-center text-muted-foreground'>© 2024 URAI</div>}
        </div>
    );
}

export default Sidebar;
