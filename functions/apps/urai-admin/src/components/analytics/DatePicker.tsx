'use client';

import React from 'react';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  maxDate: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange, maxDate }) => {
  return (
    <div className="mb-4">
      <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-1">
        Select Date
      </label>
      <input
        type="date"
        id="date-picker"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        max={maxDate}
        className="bg-white border border-gray-300 rounded-md shadow-sm p-2 text-sm"
      />
    </div>
  );
};
