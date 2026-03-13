'use client';
import React from 'react';
export var MetricCard = function (_a) {
    var title = _a.title, value = _a.value, description = _a.description;
    return (<div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-700">{title}</h2>
      <p className="text-4xl font-semibold my-2">{value}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>);
};
