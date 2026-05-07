'use client';
import { useEffect, useState } from 'react';
export function LogsViewer(_a) {
    var tag = _a.tag;
    var _b = useState({ brokenLinks: [], consoleErrors: [] }), logs = _b[0], setLogs = _b[1];
    useEffect(function () {
        if (tag) {
            fetch("/api/qa/logs?tag=".concat(tag))
                .then(function (res) { return res.json(); })
                .then(function (data) { return setLogs(data); });
        }
    }, [tag]);
    return (<div>
            <h3 className="text-lg font-semibold mb-2">Broken Links</h3>
            <table className="table-auto border-collapse border border-gray-400 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">URL</th>
                        <th className="border border-gray-300 p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.brokenLinks.map(function (link, i) { return (<tr key={i}>
                            <td className="border border-gray-300 p-2">{link.url}</td>
                            <td className="border border-gray-300 p-2">{link.status}</td>
                        </tr>); })}
                </tbody>
            </table>

            <h3 className="text-lg font-semibold mt-8 mb-2">Console Errors</h3>
            <div className="bg-gray-100 p-4 rounded-md">
                {logs.consoleErrors.map(function (error, i) { return (<pre key={i} className="whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>); })}
            </div>
        </div>);
}
