'use client';

import { useEffect, useState, useMemo } from 'react';
import { DatePicker } from '@/components/analytics/DatePicker';
import { MetricCard } from '@/components/analytics/MetricCard';
import { EventsTable } from '@/components/analytics/EventsTable';

interface AnalyticsData {
  dau: { count: number; date: string };
  events: { counts: Record<string, number>; date: string };
}

// Helper to get a date string in YYYY-MM-DD format for yesterday
const getYesterdayDateString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(getYesterdayDateString());

  const maxDate = useMemo(() => getYesterdayDateString(), []);

  useEffect(() => {
    async function fetchData(date: string) {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/analytics?date=${date}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        const json: AnalyticsData = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message);
        setData(null); // Clear previous data on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchData(selectedDate);
  }, [selectedDate]);

  const totalEvents = useMemo(() => {
      if (!data?.events?.counts) return 0;
      return Object.values(data.events.counts).reduce((a, b) => a + b, 0);
  }, [data]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} maxDate={maxDate} />
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <MetricCard 
                title="Daily Active Users (DAU)" 
                value={data.dau?.count ?? 0} 
                description={`for ${data.dau?.date}`}
             />
             <MetricCard 
                title="Total Events"
                value={totalEvents}
                description={`for ${data.events?.date}`}
            />
          </div>
          <EventsTable data={data.events?.counts ?? {}} />
        </div>
      )}
    </div>
  );
}
