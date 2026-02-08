import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');

    if (!imagePath) {
        return NextResponse.json({ error: 'path is required' }, { status: 400 });
    }

    try {
        const imageBuffer = await fs.readFile(imagePath);
        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png'
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
}
