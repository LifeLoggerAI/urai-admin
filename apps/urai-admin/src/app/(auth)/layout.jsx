export default function AuthLayout(_a) {
    var children = _a.children;
    return (<div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {children}
      </div>
    </div>);
}
