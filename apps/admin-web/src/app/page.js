'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
function HomePage() {
    var router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(function () {
        router.replace('/admin/dashboard');
    }, [router]);
    return null;
}
