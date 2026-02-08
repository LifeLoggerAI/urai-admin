'use client';

import { useEffect, useState } from 'react';
import { InteractiveDiffItem } from './InteractiveDiffItem';

export function DiffViewer({ prevTag, currTag }: { prevTag: string; currTag: string }) {
    const [diffs, setDiffs] = useState<any[]>([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (prevTag && currTag) {
            fetch(`/api/qa/diff?prevTag=${prevTag}&currTag=${currTag}`)
                .then(res => res.json())
                .then(data => {
                    if (data.visualRegressions) {
                        setDiffs(data.visualRegressions);
                    }
                });
        }
    }, [prevTag, currTag]);

    const filteredDiffs = diffs.filter(item => {
        if (filter === 'all') return true;
        const itemType = item.key.includes('hover') ? 'hover' : item.key.includes('focus') ? 'focus' : item.key.includes('anim') ? 'animation' : 'normal';
        return itemType === filter;
    });

    return (
        <div>
            <div className="mb-4 flex gap-2">
                <label>Filter:</label>
                <select onChange={e => setFilter(e.target.value)} value={filter} className="p-2 border rounded">
                    <option value="all">All</option>
                    <option value="normal">Normal</option>
                    <option value="hover">Hover</option>
                    <option value="focus">Focus</option>
                    <option value="animation">Animation</option>
                </select>
            </div>
            <div className="grid gap-6">
                {filteredDiffs.map(item => (
                    <InteractiveDiffItem key={item.key} item={item} />
                ))}
            </div>
        </div>
    );
}
