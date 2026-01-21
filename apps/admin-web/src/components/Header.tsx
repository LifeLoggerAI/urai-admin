
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { navItems } from "@/lib/nav-items";
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();
    const title = navItems.find(item => item.href === pathname)?.title || 'Overview';

    return (
        <header className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">{title}</h1>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" />
                        <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Super Admin</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

export default Header;
