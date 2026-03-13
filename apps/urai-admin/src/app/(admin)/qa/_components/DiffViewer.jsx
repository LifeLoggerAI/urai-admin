'use client';
import { useEffect, useState } from 'react';
import { InteractiveDiffItem } from './InteractiveDiffItem';
export function DiffViewer(_a) {
    var prevTag = _a.prevTag, currTag = _a.currTag;
    var _b = useState([]), diffs = _b[0], setDiffs = _b[1];
    var _c = useState('all'), filter = _c[0], setFilter = _c[1];
    useEffect(function () {
        if (prevTag && currTag) {
            fetch("/api/qa/diff?prevTag=".concat(prevTag, "&currTag=").concat(currTag))
                .then(function (res) { return res.json(); })
                .then(function (data) {
                if (data.visualRegressions) {
                    setDiffs(data.visualRegressions);
                }
            });
        }
    }, [prevTag, currTag]);
    var filteredDiffs = diffs.filter(function (item) {
        if (filter === 'all')
            return true;
        var itemType = item.key.includes('hover') ? 'hover' : item.key.includes('focus') ? 'focus' : item.key.includes('anim') ? 'animation' : 'normal';
        return itemType === filter;
    });
    return (<div>
            <div className="mb-4 flex gap-2">
                <label>Filter:</label>
                <select onChange={function (e) { return setFilter(e.target.value); }} value={filter} className="p-2 border rounded">
                    <option value="all">All</option>
                    <option value="normal">Normal</option>
                    <option value="hover">Hover</option>
                    <option value="focus">Focus</option>
                    <option value="animation">Animation</option>
                </select>
            </div>
            <div className="grid gap-6">
                {filteredDiffs.map(function (item) { return (<InteractiveDiffItem key={item.key} item={item}/>); })}
            </div>
        </div>);
}
