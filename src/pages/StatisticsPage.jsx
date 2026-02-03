/**
 * StatisticsPage Component
 * Detailed analytics and insights page
 */
export default function StatisticsPage() {
    const EmptyCard = ({ title, icon }) => (
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

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EmptyCard
                    title="By Category"
                    icon={
                        <svg className="w-5 h-5 text-[var(--color-text-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    }
                />

                <EmptyCard
                    title="By Designation"
                    icon={
                        <svg className="w-5 h-5 text-[var(--color-text-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <polyline points="17 11 19 13 23 9" />
                        </svg>
                    }
                />
            </div>
        </div>
    );
}
