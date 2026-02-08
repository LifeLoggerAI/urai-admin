'use client';

import { useEffect, useState } from 'react';

export function SnapshotSelector({ onSelect, id }: { onSelect: (tag: string) => void; id: string }) {
    const [snapshots, setSnapshots] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/qa/snapshots')
            .then(res => res.json())
            .then(data => setSnapshots(data));
    }, []);

    return (
        <select id={id} onChange={e => onSelect(e.target.value)} className="p-2 border rounded">
            <option value="">Select Snapshot</option>
            {snapshots.map(snapshot => (
                <option key={snapshot} value={snapshot}>
                    {snapshot}
                </option>
            ))}
        </select>
    );
}
