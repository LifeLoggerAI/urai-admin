
import { ShieldCheck, Users, BarChart2, Cpu, GitCommit, Briefcase, ShoppingCart, HeartHandshake, Beaker, Settings } from "lucide-react";

export const navItems = [
    {
        title: "Overview",
        href: "/admin",
        icon: BarChart2,
        role: "viewer"
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
        role: "support"
    },
    {
        title: "Data & Signals",
        href: "/admin/signals",
        icon: GitCommit,
        role: "analyst"
    },
    {
        title: "AI & Intelligence",
        href: "/admin/intelligence",
        icon: Cpu,
        role: "admin"
    },
    {
        title: "Timeline & Memory",
        href: "/admin/timeline",
        icon: GitCommit,
        role: "admin"
    },
    {
        title: "Jobs & Pipelines",
        href: "/admin/jobs",
        icon: Briefcase,
        role: "admin"
    },
    {
        title: "Monetization",
        href: "/admin/marketplace",
        icon: ShoppingCart,
        role: "super_admin"
    },
    {
        title: "Safety & Ethics",
        href: "/admin/ethics",
        icon: HeartHandshake,
        role: "moderator"
    },
    {
        title: "Experiments",
        href: "/admin/experiments",
        icon: Beaker,
        role: "admin"
    },
    {
        title: "System Settings",
        href: "/admin/system",
        icon: Settings,
        role: "super_admin"
    }
];
