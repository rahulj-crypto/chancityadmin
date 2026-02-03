import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { adminApi } from '../services/api';
import gsap from 'gsap';
import RegistrationToggle from '../components/RegistrationToggle';

const StatCard = memo(({ title, value, icon, bgColor }) => (
    <div className="stat-card bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6 transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider font-semibold">{title}</p>
                <p className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">{value}</p>
            </div>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
                {icon}
            </div>
        </div>
    </div>
));

/**
 * DashboardPage Component
 * Optimized for mobile and fast response
 */
export default function DashboardPage() {
    const [stats, setStats] = useState({ total: 0, pending: 0, last7Days: 0, totalPlayers: 0 });
    const [recentRegistrations, setRecentRegistrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const containerRef = useRef(null);
    const fetchDataInitialized = useRef(false);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [statsData, registrationsData] = await Promise.all([
                adminApi.getStats(),
                adminApi.getRegistrations({ limit: 5 })
            ]);

            const totalPlayersCount = (registrationsData.data || []).reduce((sum, reg) => sum + (reg.team_size || 0), 0);

            setStats({
                total: statsData.total || 0,
                pending: statsData.pending || 0,
                last7Days: 0,
                totalPlayers: totalPlayersCount
            });
            setRecentRegistrations(registrationsData.data || []);
        } catch (apiError) {
            console.warn('API error:', apiError.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!fetchDataInitialized.current) {
            fetchData();
            fetchDataInitialized.current = true;
        }
    }, [fetchData]);

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            const ctx = gsap.context(() => {
                gsap.from('.stat-card', {
                    y: 15,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: 'power1.out'
                });
            }, containerRef);
            return () => ctx.revert();
        }
    }, [isLoading]);

    const formatDate = useCallback((dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="space-y-6">
            {/* Registration Toggle */}
            <div className="mb-4">
                <RegistrationToggle />
            </div>

            {/* Stats Cards - 3 cards in a row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Total Registrations"
                    value={stats.total}
                    bgColor="bg-[#fff4e6]"
                    icon={
                        <svg className="w-6 h-6 text-[var(--color-icon-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                />

                <StatCard
                    title="Last 7 Days"
                    value={stats.last7Days}
                    bgColor="bg-[#e6f7f1]"
                    icon={
                        <svg className="w-6 h-6 text-[var(--color-icon-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    }
                />

                <StatCard
                    title="Total Players"
                    value={stats.totalPlayers}
                    bgColor="bg-[#e6f2ff]"
                    icon={
                        <svg className="w-6 h-6 text-[var(--color-icon-blue)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                />
            </div>
            {/* Registrations by Category */}
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
                <div className="flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5 text-[var(--color-text-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">Registrations by Category</h3>
                </div>

                <div className="flex flex-col items-center justify-center py-12">
                    <svg className="w-16 h-16 text-[var(--color-text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-[var(--color-text-primary)] font-medium mb-1">No Data Available</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Registration data will appear here</p>
                </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                <div className="p-4 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[var(--color-text-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                        </svg>
                        <h3 className="font-semibold text-[var(--color-text-primary)]">Recent Registrations</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[var(--color-background)]">
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">Reg ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">Team Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">Contact</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {recentRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                                        No registrations yet
                                    </td>
                                </tr>
                            ) : (
                                recentRegistrations.map((reg) => (
                                    <tr key={reg.$id} className="hover:bg-[var(--color-background)] transition-colors">
                                        <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                                            #{reg.$id.slice(-6)}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">
                                            {reg.team_name || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] capitalize">
                                            {reg.category || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                                            {reg.contact_name || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                                            {formatDate(reg.$createdAt)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <button className="text-[var(--color-primary)] hover:underline">
                                                View
                                            </button>
                                        </td>
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
