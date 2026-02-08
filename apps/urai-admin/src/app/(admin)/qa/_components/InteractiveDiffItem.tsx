'use client';
import { useEffect, useRef } from 'react';
import panzoom from 'panzoom';

export function InteractiveDiffItem({ item }: { item: any }) {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (containerRef.current) {
            panzoom(containerRef.current, { maxZoom: 4, minZoom: 0.5, bounds: true, boundsPadding: 0.1 });
        }
    }, [item]);

    return (
        <div key={item.key} className="border p-2">
            <h3 className="font-semibold mb-1">{item.key} ({item.type})</h3>
            <div ref={containerRef} className="grid grid-cols-3 gap-2 border p-2">
                <div className="flex flex-col items-center">
                    <span className="text-sm mb-1">Previous</span>
                    <img src={`/api/qa/image?path=${item.prev}`} className="border" />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm mb-1">Current</span>
                    <img src={`/api/qa/image?path=${item.curr}`} className="border" />
                </div>
                <div className="flex flex-col items-center relative">
                    <span className="text-sm mb-1">Diff</span>
                    <img src={`/api/qa/image?path=${item.diff}`} className="border" />
                </div>
            </div>
        </div>
    );
}
