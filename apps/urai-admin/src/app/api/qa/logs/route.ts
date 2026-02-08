import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');

    if (!tag) {
        return NextResponse.json({ error: 'tag is required' }, { status: 400 });
    }

    const snapshotFile = path.resolve(process.env.HOME, 'deploy_logs', `urai-admin_curr_snapshot_${tag}.json`);

    try {
        const snapshotStr = await fs.readFile(snapshotFile, 'utf-8');
        const snapshot = JSON.parse(snapshotStr);

        return NextResponse.json({ 
            brokenLinks: Object.entries(snapshot.links).filter(([, status]) => status !== 200).map(([url, status]) => ({ url, status })), 
            consoleErrors: snapshot.console 
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to read snapshot file' }, { status: 500 });
    }
}
