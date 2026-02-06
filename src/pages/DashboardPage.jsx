import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import RegistrationToggle from '../components/RegistrationToggle';

const StatCard = ({ title, value, bgColor, iconColor }) => (
  <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider font-semibold">{title}</p>
        <p className="text-2xl md:text-3xl font-bold">{value}</p>
      </div>
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
        <svg className={`w-6 h-6 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, last7Days: 0, totalPlayers: 0, Senior: 0, Junior: 0 });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, registrationsData] = await Promise.all([
          adminApi.getStats(),
          adminApi.getRegistrations({ limit: 100 })
        ]);

        const registrations = registrationsData.data || [];
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const last7Days = registrations.filter(r => new Date(r.$createdAt).getTime() >= sevenDaysAgo).length;
        const senior = registrations.filter(r => r.category?.toLowerCase() === 'senior').length;
        const junior = registrations.filter(r => r.category?.toLowerCase() === 'junior').length;

        setStats({
          total: statsData.total || 0,
          pending: statsData.pending || 0,
          last7Days,
          totalPlayers: registrations.reduce((sum, r) => sum + (r.team_size || 0), 0),
          Senior: senior,
          Junior: junior
        });
        setRecentRegistrations(registrations.slice(0, 5));
      } catch (err) {
        console.error('API error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RegistrationToggle />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Registrations" value={stats.total} bgColor="bg-amber-50" iconColor="text-amber-500" />
        <StatCard title="Last 7 Days" value={stats.last7Days} bgColor="bg-emerald-50" iconColor="text-emerald-500" />
        <StatCard title="Total Players" value={stats.totalPlayers} bgColor="bg-blue-50" iconColor="text-blue-500" />
      </div>

      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <h3 className="font-semibold mb-4">Registrations by Category</h3>
        {stats.total === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-muted)]">No Data Available</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-background)] rounded-lg p-4 border border-[var(--color-border)] flex items-center justify-between">
              <span className="px-3 py-1 rounded text-sm font-bold bg-amber-50 text-amber-600 border border-amber-200">Senior</span>
              <span className="text-2xl font-bold">{stats.Senior}</span>
            </div>
            <div className="bg-[var(--color-background)] rounded-lg p-4 border border-[var(--color-border)] flex items-center justify-between">
              <span className="px-3 py-1 rounded text-sm font-bold bg-blue-50 text-blue-600 border border-blue-200">Junior</span>
              <span className="text-2xl font-bold">{stats.Junior}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <div className="p-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold">Recent Registrations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--color-background)]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Team</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-[var(--color-text-muted)]">No registrations yet</td>
                </tr>
              ) : (
                recentRegistrations.map((reg) => (
                  <tr key={reg.$id} className="hover:bg-[var(--color-background)]">
                    <td className="px-4 py-3 text-sm font-medium">{reg.team_name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm capitalize">{reg.category || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{reg.contact_name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(reg.$createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
