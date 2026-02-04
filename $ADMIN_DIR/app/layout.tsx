export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-red-500 text-white text-center p-2">
          INTERNAL ADMIN
        </div>
        {children}
      </body>
    </html>
  );
}
