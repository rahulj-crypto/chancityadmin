import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

export default function StatisticsPage() {
  const [stats, setStats] = useState({ total: 0, Senior: 0, Junior: 0, isLoading: true });

  useEffect(() => {
    adminApi.getRegistrations({ limit: 1000 })
      .then(data => {
        const registrations = data.data || [];
        setStats({
          total: registrations.length,
          Senior: registrations.filter(r => r.category?.toLowerCase() === 'senior').length,
          Junior: registrations.filter(r => r.category?.toLowerCase() === 'junior').length,
          isLoading: false
        });
      })
      .catch(() => setStats(prev => ({ ...prev, isLoading: false })));
  }, []);

  if (stats.isLoading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <h3 className="font-semibold mb-4">Statistics</h3>
        <div className="space-y-3">
          <div className="flex justify-between p-4 bg-[var(--color-background)] rounded-lg border">
            <span className="font-bold text-amber-600">Senior</span>
            <span className="text-xl font-bold">{stats.Senior}</span>
          </div>
          <div className="flex justify-between p-4 bg-[var(--color-background)] rounded-lg border">
            <span className="font-bold text-blue-600">Junior</span>
            <span className="text-xl font-bold">{stats.Junior}</span>
          </div>
          <div className="flex justify-between p-4 bg-gradient-to-r from-[var(--color-primary)] to-purple-500 rounded-lg text-white">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
