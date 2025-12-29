import React, { useState } from 'react';

const UserManagement = () => <div>User Management</div>;
const FeatureFlagManager = () => <div>Feature Flags</div>;
const AuditLogViewer = () => <div>Audit Logs</div>;
const AnalyticsPanel = () => <div>Analytics</div>;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'features' | 'audit' | 'analytics'>('users');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const renderTab = () => {
    switch (activeTab) {
      case 'users': return <UserManagement />;
      case 'features': return <FeatureFlagManager />;
      case 'audit': return <AuditLogViewer />;
      case 'analytics': return <AnalyticsPanel />;
      default: return null;
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">URAI Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </header>

      <nav className="flex gap-4 mb-4">
        {['users', 'features', 'audit', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-3 py-1 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'border hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main>
        {renderTab()}
      </main>
    </div>
  );
}
