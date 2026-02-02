
import Link from 'next/link';

export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
            <p className="text-lg mb-8">You are not authorized to view this page.</p>
            <Link href="/api/auth/logout">
                <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Sign Out
                </a>
            </Link>
        </div>
    );
}
