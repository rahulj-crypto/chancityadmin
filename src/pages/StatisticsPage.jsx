/**
 * StatisticsPage Component
 * Detailed analytics and insights page
 */
import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/api';

const CategoryCard = ({ title, icon, stats }) => {
    if (stats.isLoading) {
        return (
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
                <div className="flex items-center gap-2 mb-6">
                    {icon}
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{title}</h3>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (stats.total === 0) {
        return (
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
                <div className="flex items-center gap-2 mb-6">
                    {icon}
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{title}</h3>
                </div>

                <div className="flex flex-col items-center justify-center py-12">
                    <svg className="w-16 h-16 text-[var(--color-text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-[var(--color-text-primary)] font-medium mb-1">No Data Available</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Registration data will appear here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <div className="flex items-center gap-2 mb-6">
                {icon}
                <h3 className="font-semibold text-[var(--color-text-primary)]">{title}</h3>
            </div>

            <div className="space-y-4">
                {/* Senior */}
                <div className="flex items-center justify-between p-4 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-md text-sm font-bold bg-amber-50 text-amber-600 border border-amber-200">
                            Senior
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${stats.total > 0 ? ((stats.categoryBreakdown.Senior || 0) / stats.total * 100) : 0}%` }}
                            ></div>
                        </div>
                        <span className="text-xl font-bold text-[var(--color-text-primary)] min-w-[3rem] text-right">
                            {stats.categoryBreakdown.Senior || 0}
                        </span>
                    </div>
                </div>

                {/* Junior */}
                <div className="flex items-center justify-between p-4 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-md text-sm font-bold bg-blue-50 text-blue-600 border border-blue-200">
                            Junior
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${stats.total > 0 ? ((stats.categoryBreakdown.Junior || 0) / stats.total * 100) : 0}%` }}
                            ></div>
                        </div>
                        <span className="text-xl font-bold text-[var(--color-text-primary)] min-w-[3rem] text-right">
                            {stats.categoryBreakdown.Junior || 0}
                        </span>
                    </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--color-primary)] to-[#8B5CF6] rounded-lg text-white">
                    <span className="font-semibold">Total Registrations</span>
                    <span className="text-2xl font-bold">{stats.total}</span>
                </div>
            </div>
        </div>
    );
};

export default function StatisticsPage() {
    const [stats, setStats] = useState({
        total: 0,
        categoryBreakdown: {},
        isLoading: true
    });

    const fetchData = useCallback(async () => {
        try {
            const registrationsData = await adminApi.getRegistrations({ limit: 1000 });
            const registrations = registrationsData.data || [];

            // Calculate category breakdown
            const categoryBreakdown = registrations.reduce((acc, reg) => {
                const category = reg.category || 'Unknown';
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {});

            setStats({
                total: registrations.length,
                categoryBreakdown: categoryBreakdown,
                isLoading: false
            });
        } catch (apiError) {
            console.warn('API error:', apiError.message);
            setStats(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryCard
                    title="By Category"
                    icon={
                        <svg className="w-5 h-5 text-[var(--color-text-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    }
                    stats={stats}
                />

                <CategoryCard
                    title="By Designation"
                    icon={
                        <svg className="w-5 h-5 text-[var(--color-text-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <polyline points="17 11 19 13 23 9" />
                        </svg>
                    }
                    stats={stats}
                />
            </div>
        </div>
    );
}
