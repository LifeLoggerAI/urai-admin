'use client';
import { useEffect, useState } from 'react';
export function SnapshotSelector(_a) {
    var onSelect = _a.onSelect, id = _a.id;
    var _b = useState([]), snapshots = _b[0], setSnapshots = _b[1];
    useEffect(function () {
        fetch('/api/qa/snapshots')
            .then(function (res) { return res.json(); })
            .then(function (data) { return setSnapshots(data); });
    }, []);
    return (<select id={id} onChange={function (e) { return onSelect(e.target.value); }} className="p-2 border rounded">
            <option value="">Select Snapshot</option>
            {snapshots.map(function (snapshot) { return (<option key={snapshot} value={snapshot}>
                    {snapshot}
                </option>); })}
        </select>);
}
