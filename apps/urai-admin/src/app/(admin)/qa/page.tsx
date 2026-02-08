'use client';

import { useState } from 'react';
import { SnapshotSelector } from './_components/SnapshotSelector';
import { DiffViewer } from './_components/DiffViewer';
import { LogsViewer } from './_components/LogsViewer';

export default function QAPage() {
    const [prevTag, setPrevTag] = useState('');
    const [currTag, setCurrTag] = useState('');

    return (
        <div className="p-6">
            <h1 className="text-2xl mb-4">URAI-ADMIN Regression QA Dashboard</h1>
            <div className="flex gap-4 mb-6">
                <div>
                    <label htmlFor="prevTagSelector" className="block mb-2 text-sm font-medium text-gray-900">Previous Deploy:</label>
                    <SnapshotSelector onSelect={setPrevTag} id="prevTagSelector" />
                </div>
                <div>
                    <label htmlFor="currTagSelector" className="block mb-2 text-sm font-medium text-gray-900">Current Deploy:</label>
                    <SnapshotSelector onSelect={setCurrTag} id="currTagSelector" />
                </div>
            </div>

            {currTag && (
                <div className="mt-8">
                    <h2 className="text-xl mt-6">Logs</h2>
                    <LogsViewer tag={currTag} />
                </div>
            )}
            
            {prevTag && currTag && (
                <div className="mt-8">
                    <h2 className="text-xl mt-6">Visual Diffs</h2>
                    <DiffViewer prevTag={prevTag} currTag={currTag} />
                </div>
            )}
        </div>
    );
}
