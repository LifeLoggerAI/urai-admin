import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const prevTag = searchParams.get('prevTag');
    const currTag = searchParams.get('currTag');

    if (!prevTag || !currTag) {
        return NextResponse.json({ error: 'prevTag and currTag are required' }, { status: 400 });
    }

    const currSnapshotFile = path.resolve(process.env.HOME, 'deploy_logs', `urai-admin_curr_snapshot_${currTag}.json`);
    const prevSnapshotFile = path.resolve(process.env.HOME, 'deploy_logs', `urai-admin_curr_snapshot_${prevTag}.json`);
    const diffDir = path.resolve(process.env.HOME, 'deploy_diffs', `urai-admin_${currTag}`);

    try {
        const [currSnapshotStr, prevSnapshotStr] = await Promise.all([
            fs.readFile(currSnapshotFile, 'utf-8'),
            fs.readFile(prevSnapshotFile, 'utf-8')
        ]);

        const currSnapshot = JSON.parse(currSnapshotStr);
        const prevSnapshot = JSON.parse(prevSnapshotStr);

        const visualRegressions = Object.keys(currSnapshot.screenshots)
            .filter(key => prevSnapshot.screenshots[key] && prevSnapshot.screenshots[key] !== currSnapshot.screenshots[key])
            .map(key => {
                const safeKey = key.replace(/\//g, '_');
                return {
                    key,
                    diff: path.join(diffDir, `${safeKey}_diff.png`),
                    prev: path.join(process.env.HOME, 'deploy_screenshots', `urai-admin_${prevTag}`, `${safeKey}.png`),
                    curr: path.join(process.env.HOME, 'deploy_screenshots', `urai-admin_${currTag}`, `${safeKey}.png`),
                };
            });

        return NextResponse.json({ visualRegressions });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate diff' }, { status: 500 });
    }
}
