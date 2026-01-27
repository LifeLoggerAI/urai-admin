
import React from "react";
import Card from "./(components)/card";

const DashboardPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Users" value="1,234" />
        <Card title="Jobs" value="56" />
        <Card title="Events" value="7,890" />
        <Card title="Errors" value="12" />
      </div>
    </div>
  );
};

export default DashboardPage;
