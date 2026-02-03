
'use client';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">System Configuration</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Project ID:</p>
            <p className="text-gray-700">urai-admin-73155349</p>
          </div>
          <div>
            <p className="font-semibold">Region:</p>
            <p className="text-gray-700">us-central1</p>
          </div>
          <div>
            <p className="font-semibold">Mode:</p>
            <p className="text-gray-700">Production</p>
          </div>
        </div>
      </div>
    </div>
  );
}
