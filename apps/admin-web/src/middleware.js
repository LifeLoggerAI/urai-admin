"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
var server_1 = require("next/server");
function middleware(request) {
    var cookie = request.cookies.get('firebaseIdToken');
    var pathname = request.nextUrl.pathname;
    // If user is not authenticated and trying to access a protected route, redirect to login
    if (!cookie && pathname.startsWith('/admin')) {
        return server_1.NextResponse.redirect(new URL('/login', request.url));
    }
    // If user is authenticated and trying to access the login page, redirect to dashboard
    if (cookie && pathname === '/login') {
        return server_1.NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return server_1.NextResponse.next();
}
exports.config = {
    matcher: ['/admin/:path*', '/login'],
};
