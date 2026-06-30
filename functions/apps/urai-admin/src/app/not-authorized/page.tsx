
import React from "react";

const NotAuthorizedPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Not Authorized</h1>
        <p className="mt-4 text-lg">You do not have permission to view this page.</p>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
