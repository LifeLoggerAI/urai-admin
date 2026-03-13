import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Circle, XCircle, Clock, MoreHorizontal, } from 'lucide-react';
export var labels = [
    {
        value: 'bug',
        label: 'Bug',
    },
    {
        value: 'feature',
        label: 'Feature',
    },
    {
        value: 'documentation',
        label: 'Documentation',
    },
];
export var statuses = [
    {
        value: 'backlog',
        label: 'Backlog',
        icon: MoreHorizontal,
    },
    {
        value: 'todo',
        label: 'Todo',
        icon: Circle,
    },
    {
        value: 'in progress',
        label: 'In Progress',
        icon: Clock,
    },
    {
        value: 'done',
        label: 'Done',
        icon: CheckCircle,
    },
    {
        value: 'canceled',
        label: 'Canceled',
        icon: XCircle,
    },
];
export var priorities = [
    {
        label: 'Low',
        value: 'low',
        icon: ArrowDown,
    },
    {
        label: 'Medium',
        value: 'medium',
        icon: ArrowRight,
    },
    {
        label: 'High',
        value: 'high',
        icon: ArrowUp,
    },
];
