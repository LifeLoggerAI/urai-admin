import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    const logDir = path.resolve(process.env.HOME, 'deploy_logs');
    try {
        const files = await fs.readdir(logDir);
        const snapshotFiles = files.filter(file => file.startsWith('urai-admin_curr_snapshot_') && file.endsWith('.json'));
        const tags = snapshotFiles.map(file => file.replace('urai-admin_curr_snapshot_', '').replace('.json', ''));
        return NextResponse.json(tags);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read snapshot directory' }, { status: 500 });
    }
}
