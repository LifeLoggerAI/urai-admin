import React from 'react';

const NotAuthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Not Authorized</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">You do not have permission to view this page.</p>
    </div>
  );
};

export default NotAuthorized;
