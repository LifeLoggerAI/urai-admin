import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
var geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
var geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
export var metadata = {
    title: 'Urai Admin',
    description: 'Admin console for Urai',
};
export default function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en">
      <body className={"".concat(geistSans.variable, " ").concat(geistMono.variable)}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>);
}
