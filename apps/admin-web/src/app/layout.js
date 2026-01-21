"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
var google_1 = require("next/font/google");
var auth_provider_1 = require("@/lib/auth-provider");
var toaster_1 = require("@/components/ui/toaster");
require("./globals.css");
var inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "URAI Admin Console",
    description: "Administration for the URAI ecosystem",
};
function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <auth_provider_1.AuthProvider>
          {children}
          <toaster_1.Toaster />
        </auth_provider_1.AuthProvider>
      </body>
    </html>);
}
