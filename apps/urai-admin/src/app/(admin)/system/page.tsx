
import React from "react";
import ControlButton from "./(components)/control-button";

const SystemPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">System Controls</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ControlButton label="Toggle Maintenance Mode" />
        <ControlButton label="Toggle Jobs Paused" />
        <ControlButton label="Toggle Exports Paused" />
        <ControlButton label="Invalidate Foundation Config Cache" />
        <ControlButton label="Invalidate Jobs Cache" />
      </div>
    </div>
  );
};

export default SystemPage;
