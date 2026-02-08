'use client';

import { useEffect, useState } from 'react';

export function LogsViewer({ tag }: { tag: string }) {
    const [logs, setLogs] = useState<{ brokenLinks: any[], consoleErrors: any[] }>({ brokenLinks: [], consoleErrors: [] });

    useEffect(() => {
        if (tag) {
            fetch(`/api/qa/logs?tag=${tag}`)
                .then(res => res.json())
                .then(data => setLogs(data));
        }
    }, [tag]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Broken Links</h3>
            <table className="table-auto border-collapse border border-gray-400 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">URL</th>
                        <th className="border border-gray-300 p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.brokenLinks.map((link, i) => (
                        <tr key={i}>
                            <td className="border border-gray-300 p-2">{link.url}</td>
                            <td className="border border-gray-300 p-2">{link.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 className="text-lg font-semibold mt-8 mb-2">Console Errors</h3>
            <div className="bg-gray-100 p-4 rounded-md">
                {logs.consoleErrors.map((error, i) => (
                    <pre key={i} className="whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
                ))}
            </div>
        </div>
    );
}
